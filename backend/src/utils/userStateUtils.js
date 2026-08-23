import pool from "../db.js"

import { getCurrentMonthKey, getCurrentWeekKey, parseLocalDate } from "../utils/dateUtils.js"
import { createSystemNotification } from "../services/notificationService.js"
import { evaluateChallenges } from "./challengeUtils.js"
import { calculateStreak } from "./streakUtils.js"
import { triggerProactiveInsight } from "./insightUtils.js"

export async function recalculateUserState(userId) {
    // get all user transactions
    const transactionsRes = await pool.query(
        `SELECT * FROM transactions WHERE user_id = $1`,
        [userId]
    )

    const transactions = transactionsRes.rows

    // get all user check-ins
    const checkInsRes = await pool.query(
        `SELECT * FROM check_ins WHERE user_id = $1`,
        [userId]
    )

    const checkIns = checkInsRes.rows

    // get challenges
    const challengesRes = await pool.query(
        `SELECT * FROM challenges WHERE user_id = $1`,
        [userId]
    )

    const challenges = challengesRes.rows

    // get budget
    const budgetRes = await pool.query(
        `SELECT * FROM budgets WHERE user_id = $1`,
        [userId]
    )

    const budget = budgetRes.rows[0]

    const streak = calculateStreak(transactions, checkIns)

    // get goals category to update Growing challenge 
    const goalCategoryRes = await pool.query(
        `SELECT * FROM categories WHERE user_id = $1 AND is_default = true AND name = 'Goals' AND type = 'expense'`,
        [userId]
    )

    const goalCategoryId = goalCategoryRes.rows[0]?.id

    // evaluate challenges
    const updatedChallenges = evaluateChallenges({
        transactions,
        streak,
        budget,
        challenges,
        goalCategoryId
    })

    // create challenge notifications
    for (const c of updatedChallenges) {
        // update progress
        await pool.query(
            `UPDATE challenges SET progress = $1, completed = $2 WHERE id = $3 AND user_id = $4`,
            [c.progress, c.completed, c.id, userId]
        )

        // then handle notifications
        if (!c.completed) continue

        const periodKey = c.period === "weekly"
            ? getCurrentWeekKey()
            : getCurrentMonthKey()

        await createSystemNotification({
            userId,
            type: "challenge",
            title: "Challenge completed",
            message: `${c.title} completed! Keep going.`,
            eventKey: `challenge_${c.id}_${periodKey}`
        })
    }

    // get expenses for current month
    const now = new Date()

    const expenses = transactions
        .filter(t => {
            if (t.type !== "expense" || !t.date) return false

            const d = parseLocalDate(t.date)
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        })
        .reduce((sum, t) => sum + Number(t.amount), 0)
        
    const percentUsedBudget = budget?.monthly_limit
        ? (expenses / budget.monthly_limit) * 100
        : 0

    // create near budget notifications    
    if (budget?.monthly_limit && percentUsedBudget >= 80 && percentUsedBudget <= 100) {
        const monthKey = getCurrentMonthKey()

        await createSystemNotification({
            userId,
            type: "budget",
            title: "Almost there...",
            message: "You're close to your monthly budget.",
            eventKey: `budget_near_${monthKey}`
        })
    }

    // create exceeded budget notifications    
    if (budget?.monthly_limit && percentUsedBudget > 100) {
        const monthKey = getCurrentMonthKey()

        await createSystemNotification({
            userId,
            type: "budget",
            title: "Budget exceeded",
            message: "You've gone over your monthly budget.",
            eventKey: `budget_exceeded_${monthKey}`
        })
    }

    // fire-and-forget: check the cooldown internally and never affect the triggering action
    triggerProactiveInsight(userId).catch(err => 
        console.error("Trigger proactive insight fire-and-forget error: ", err)
    )
}