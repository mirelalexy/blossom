import pool from "../db.js"
import { createSystemNotification } from "../services/notificationService.js"
import { getLevelFromXP } from "../utils/levelUtils.js"
import { recalculateUserState } from "../utils/userStateUtils.js"
import { processRecurringTransactions } from "../utils/transactionUtils.js"

import { XP } from "../utils/xpConfig.js"

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
            (user_id, amount, type, method, title, category_id, date, mood, intent, notes, is_recurring, recur_frequency, recur_day_of_month, recur_day_of_week, recurring_parent_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
                recurring?.dayOfWeek || null,
                null
            ]
        )

        // get user xp and level
        const userRes = await pool.query(
            `SELECT xp, level FROM users WHERE id = $1`,
            [userId]
        )

        const prevXP = userRes.rows[0]?.xp || 0
        const prevLevel = userRes.rows[0]?.level || 1

        const xpGain = XP.TRANSACTION

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
        
        res.json({
            transaction: result.rows[0],
            xp: {
                gained: xpGain,
                newXP,
                newLevel,
                leveledUp: newLevel > prevLevel
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create transaction failed" })
    }
}

export async function getTransactions(req, res) {
    const userId = req.user.userId

    try {
        await processRecurringTransactions(userId)
        
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
            WHERE user_id = $1
            AND (
                id = $2
                OR (recurring_parent_id = $2 AND date > CURRENT_DATE)
            )
            RETURNING *`,
            [userId, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" })
        }

        await recalculateUserState(userId)

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
        // if this is (becoming) a recurring parent, delete all future children before updating
        // also available for case when user turns off recurring
        await pool.query(
            `DELETE FROM transactions
            WHERE user_id = $1
            AND recurring_parent_id = $2
            AND date > CURRENT_DATE`,
            [userId, id]
        )

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

        await processRecurringTransactions(userId)
        await recalculateUserState(userId)

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Edit failed" })
    }
}