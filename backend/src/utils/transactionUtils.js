import pool from "../db.js"
import { getStartOfDay, parseLocalDate } from "./dateUtils.js"

export async function processRecurringTransactions(userId) {
    const today = getStartOfDay(new Date())

    // get all recurring templates
    const recurringRes = await pool.query(
        `SELECT * FROM transactions WHERE user_id = $1 AND is_recurring = true`,
        [userId]
    )

    const recurring = recurringRes.rows

    for (const t of recurring) {
        // find last generated transaction
        const lastRes = await pool.query(
            `SELECT date FROM transactions
            WHERE user_id = $1
            AND recurring_parent_id = $2
            ORDER BY date DESC
            LIMIT 1`,
            [userId, t.id]
        )

        let lastDate

        if (lastRes.rows.length > 0) {
            lastDate = parseLocalDate(lastRes.rows[0].date)
        } else {
            lastDate = parseLocalDate(t.date)
        }

        lastDate = getStartOfDay(lastDate)

        // move forward day by day
        let current = new Date(lastDate)
        current.setDate(current.getDate() + 1)

        while (current <= today) {
            let shouldCreate = false

            if (t.recur_frequency === "weekly") {
                shouldCreate = current.getDay() === t.recur_day_of_week
            }

            if (t.recur_frequency === "monthly") {
                shouldCreate = current.getDate() === t.recur_day_of_month
            }

            // create new transaction
            if (shouldCreate) {
                await pool.query(
                    `INSERT INTO transactions
                    (user_id, amount, type, method, title, category_id, date, mood, intent, notes, recurring_parent_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        userId,
                        t.amount,
                        t.type.toLowerCase(),
                        t.method.toLowerCase(),
                        t.title,
                        t.category_id,
                        current.toISOString().slice(0, 10),
                        t.mood,
                        t.intent,
                        t.notes,
                        t.id
                    ]
                )
            }

            current.setDate(current.getDate() + 1)
        }
    }
}