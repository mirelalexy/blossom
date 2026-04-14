import pool from "../db.js"
import { createSystemNotification } from "../services/notificationService.js"
import { calculateXP, getLevelFromXP } from "../utils/levelUtils.js"
import { evaluateChallenges } from "../utils/challengeUtils.js"
import { getCurrentMonthKey, getCurrentWeekKey } from "../utils/dateUtils.js"
import { calculateStreak } from "../utils/streakUtils.js"

export async function createTransaction(req, res) {
    const {
        amount,
        type,
        method,
        title,
        categoryId,
        date,
        recurring,
        mood,
        intent,
        notes
    } = req.body

    const userId = req.user.userId

    try {
        const result = await pool.query(
            `INSERT INTO transactions
            (user_id, amount, type, method, title, category_id, date, mood, intent, notes, is_recurring, recur_frequency, recur_day_of_month, recur_day_of_week)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING
                id,
                user_id,
                category_id,
                amount,
                type,
                method,
                title,
                notes,
                date::text AS date,
                mood,
                intent,
                is_recurring,
                recur_frequency,
                recur_day_of_month,
                recur_day_of_week,
                created_at`,
            [
                userId,
                amount,
                type.toLowerCase(),
                method.toLowerCase(),
                title,
                categoryId,
                date,
                mood,
                intent,
                notes,
                !!recurring,
                recurring?.frequency ?? null,
                recurring?.dayOfMonth || null,
                recurring?.dayOfWeek || null
            ]
        )

        // get all user transactions
        const transactionsRes = await pool.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [userId]
        )

        const transactions = transactionsRes.rows

        // calculate xp and level
        const xp = calculateXP({ transactions })
        const level = getLevelFromXP(xp)

        // create level up notification
        if (level > 1) {
            await createSystemNotification({
                userId,
                type: "level",
                title: "Level up!",
                message: `You reached level ${level}`,
                eventKey: `level_${level}`
            })
        }

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
        
        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create transaction failed" })
    }
}

export async function getTransactions(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT
                id,
                user_id,
                category_id,
                amount,
                type,
                method,
                title,
                notes,
                date::text AS date,
                mood,
                intent,
                is_recurring,
                recur_frequency,
                recur_day_of_month,
                recur_day_of_week,
                created_at
            FROM transactions
            WHERE user_id = $1
            ORDER BY date DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch failed" })
    }
}

export async function deleteTransaction(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    
    try {
        const result = await pool.query(
            `DELETE FROM transactions
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" })
        }

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete failed" })
    }
}

export async function editTransaction(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    const {
        amount,
        type,
        method,
        title,
        categoryId,
        date,
        recurring,
        mood,
        intent,
        notes
    } = req.body

    try {
        const result = await pool.query(
            `UPDATE transactions SET
                amount = $1,
                type = $2,
                method = $3,
                title = $4,
                category_id = $5,
                date = $6,
                mood = $7,
                intent = $8,
                notes = $9,
                is_recurring = $10,
                recur_frequency = $11,
                recur_day_of_month = $12,
                recur_day_of_week = $13
            WHERE id = $14 AND user_id = $15
            RETURNING
                id,
                user_id,
                category_id,
                amount,
                type,
                method,
                title,
                notes,
                date::text AS date,
                mood,
                intent,
                is_recurring,
                recur_frequency,
                recur_day_of_month,
                recur_day_of_week,
                created_at`,
            [
                amount,
                type.toLowerCase(),
                method.toLowerCase(),
                title,
                categoryId,
                date,
                mood,
                intent,
                notes,
                !!recurring,
                recurring?.frequency ?? null,
                recurring?.dayOfMonth || null,
                recurring?.dayOfWeek || null,
                id,
                userId
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Edit failed" })
    }
}