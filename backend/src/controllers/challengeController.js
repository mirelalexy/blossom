import pool from "../db.js"

import { evaluateChallenges } from "../utils/challengeUtils.js"
import { calculateStreak } from "../utils/streakUtils.js"

export async function getChallenges(req, res) {
    const userId = req.user.userId

    try {
        const [userRes, transactionsRes, checkInsRes, challengesRes, budgetRes, goalCategoryRes] = await Promise.all([
            pool.query(`SELECT timezone FROM users WHERE id = $1`, [userId]),
            pool.query(`SELECT * FROM transactions WHERE user_id = $1`, [userId]),
            pool.query(`SELECT * FROM check_ins WHERE user_id = $1`, [userId]),
            pool.query(`SELECT * FROM challenges WHERE user_id = $1`, [userId]),
            pool.query(`SELECT * FROM budgets WHERE user_id = $1`, [userId]),
            pool.query(`SELECT * FROM categories WHERE 
                user_id = $1 
                AND is_default = true 
                AND name = 'Goals' 
                AND type = 'expense'`, 
                [userId]
            ),
        ])

        const timezone = userRes.rows[0]?.timezone || "UTC"
        const transactions = transactionsRes.rows
        const checkIns = checkInsRes.rows
        const challenges = challengesRes.rows
        const budget = budgetRes.rows[0]
        const goalCategoryId = goalCategoryRes.rows[0]?.id

        const streak = calculateStreak(transactions, checkIns, timezone)

        const freshChallenges = evaluateChallenges({
            transactions,
            streak,
            budget,
            challenges,
            goalCategoryId,
            timezone
        })

        res.json(freshChallenges)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Fetch challenges failed" })
    }
}