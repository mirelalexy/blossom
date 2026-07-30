import pool from "../db.js"
import { createSystemNotification } from "../services/notificationService.js"
import { getLevelFromXP } from "../utils/levelUtils.js"
import { recalculateUserState } from "../utils/userStateUtils.js"
import { toDateStringLocal } from "../utils/dateUtils.js"

import { XP } from "../utils/xpConfig.js"

export async function createCheckIn(req, res) {
    const { mood, notes } = req.body
    const userId = req.user.userId

    const today = toDateStringLocal(new Date())

    try {
        // check if a check-in already exists
        const existing = await pool.query(
            `SELECT id FROM check_ins WHERE user_id = $1 AND date = $2`,
            [userId, today]
        )

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "You've already checked in today." })
        }

        const result = await pool.query(
            `INSERT INTO check_ins (user_id, date, mood, notes)
            VALUES ($1, $2, $3, $4)
            RETURNING id, date::text AS date, mood, notes, created_at`,
            [userId, today, mood ?? null, notes ?? null]
        )

        // get user xp and level
        const userRes = await pool.query(
            `SELECT xp, level FROM users WHERE id = $1`,
            [userId]
        )

        const prevXP = userRes.rows[0]?.xp || 0
        const prevLevel = userRes.rows[0]?.level || 1

        const xpGain = XP.CHECK_IN

        const newXP = prevXP + xpGain
        const newLevel = getLevelFromXP(newXP)

        // update user
        await pool.query(
            `UPDATE users SET xp = $1, level = $2 WHERE id = $3`,
            [newXP, newLevel, userId]
        )

        // create level up notification
        if (newLevel > prevLevel) {
            for (let lvl = prevLevel + 1; lvl <= newLevel; lvl++) {
                await createSystemNotification({
                    userId,
                    type: "level",
                    title: "Level up!",
                    message: `You reached level ${lvl}`,
                    eventKey: `level_${lvl}`
                })
            }
        }

        await recalculateUserState(userId)
        
        res.status(201).json({ ...result.rows[0], xp: xpGain })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Create check-in failed" })
    }
}

export async function getTodayCheckIn(req, res) {
    const userId = req.user.userId
    const today = toDateStringLocal(new Date())

    try {
        const result = await pool.query(
            `SELECT id, date::text AS date, mood, notes, created_at
            FROM check_ins WHERE user_id = $1 AND date = $2`,
            [userId, today]
        )

        res.json(result.rows[0] || null)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Fetch today's check-in failed" })
    }
}

export async function updateCheckInNotes(req, res) {
    const userId = req.user.userId
    const { notes } = req.body
    const today = toDateStringLocal(new Date())

    try {
        const result = await pool.query(
            `UPDATE check_ins
            SET notes = $1
            WHERE user_id = $2 AND date = $3
            RETURNING id, date::text AS date, mood, notes, created_at`,
            [notes ?? null, userId, today]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No check-in found for today." })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update notes" })
    }
}