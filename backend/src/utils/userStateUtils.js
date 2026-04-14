import pool from "../db.js"

import { getCurrentMonthKey } from "../utils/dateUtils.js"
import { createSystemNotification } from "../services/notificationService.js"
import { evaluateChallenges } from "./challengeUtils.js"
import { calculateStreak } from "./streakUtils.js"

export async function recalculateUserState(userId) {
    // get all user transactions
    const transactionsRes = await pool.query(
        `SELECT * FROM transactions WHERE user_id = $1`,
        [userId]
    )

    const transactions = transactionsRes.rows

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

    const streak = calculateStreak(transactions)

    // evaluate challenges
    const updatedChallenges = evaluateChallenges({
        transactions,
        streak,
        budget,
        challenges
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

    const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)
        
    const percentUsedBudget = budget?.monthly_limit
        ? (expenses / budget.monthly_limit) * 100
        : 0

    // create near budget notifications    
    if (budget?.monthly_limit && percentUsedBudget >= 80) {
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
}