import pool from "../db.js"

import { calculateXP, getLevelFromXP, getLevelProgress, getLevelTitle } from "../utils/levelUtils.js"
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

        const completedChallenges = challenges.filter(c => c.completed).length

        // calculate stats
        const streak = calculateStreak(transactions)

        const xp = calculateXP({
            transactions,
            streak,
            goalsCompleted: 0,
            weeklyLimitsHit: 0,
            completedChallenges
        })

        const level = getLevelFromXP(xp)
        const progress = getLevelProgress(xp)
        const levelTitle = getLevelTitle(xp)

        res.json({ streak, xp, level, progress, levelTitle })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch profile stats" })
    }
}