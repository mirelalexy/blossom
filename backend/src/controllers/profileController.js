import pool from "../db.js"

import { getLevelProgress, getLevelTitle } from "../utils/levelUtils.js"
import { calculateStreak } from "../utils/streakUtils.js"

export async function getProfileStats(req, res) {
    const userId = req.user.userId

    try {
        // get transactions
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

        // calculate stats
        const streak = calculateStreak(transactions)

        const userRes = await pool.query(
            `SELECT xp, level FROM users WHERE id = $1`,
            [userId]
        )

        const xp = userRes.rows[0]?.xp || 0
        const level = userRes.rows[0]?.level || 1

        const progress = getLevelProgress(xp)
        const levelTitle = getLevelTitle(level)

        res.json({ streak, xp, level, progress, levelTitle })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch profile stats" })
    }
}