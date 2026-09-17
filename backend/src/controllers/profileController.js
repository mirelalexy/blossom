import pool from "../db.js"

import { getLevelProgress, getLevelTitle } from "../utils/levelUtils.js"
import { calculatePeakStreak, calculateStreak } from "../utils/streakUtils.js"

export async function getProfileStats(req, res) {
    const userId = req.user.userId

    try {
        // get transactions
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

        const userRes = await pool.query(
            `SELECT xp, level, timezone FROM users WHERE id = $1`,
            [userId]
        )

        const xp = userRes.rows[0]?.xp || 0
        const level = userRes.rows[0]?.level || 1
        const timezone = userRes.rows[0]?.timezone || "UTC"

        // calculate stats
        const streak = calculateStreak(transactions, checkIns, timezone)

        const progress = getLevelProgress(xp)
        const levelTitle = getLevelTitle(level)

        res.json({ streak, xp, level, progress, levelTitle })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch profile stats" })
    }
}

export async function getPeakStreak(req, res) {
    const userId = req.user.userId
    const { month } = req.query

    try {
        const transactionsRes = await pool.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [userId]
        )

        const checkInsRes = await pool.query(
            `SELECT * FROM check_ins WHERE user_id = $1`,
            [userId]
        )

        const userRes = await pool.query(
            `SELECT timezone FROM users WHERE id = $1`,
            [userId]
        )

        const timezone = userRes.rows[0]?.timezone || "UTC"
        const peakStreak = calculatePeakStreak(transactionsRes.rows, checkInsRes.rows, month, timezone)

        res.json({ peakStreak })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch peak streak" })
    }
}