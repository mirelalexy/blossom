import pool from "../db.js"
import { getStartOfDay, parseLocalDate, toDateStringLocal } from "./dateUtils.js"

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

        // PHASE 1. generate past and today occurrences
        // move forward day by day
        let current = new Date(lastDate)
        current.setDate(current.getDate() + 1)

        while (current <= today) {
            if (matchesRecurrence(t, current)) {
                await insertOccurrence(t, userId, current)
            }
            current.setDate(current.getDate() + 1)
        }

        // PHASE 2. generate the next future occurrence
        // move forward and cap at 60 days to avoid infinite loop for misconfigured records
        let next = new Date(today)
        next.setDate(next.getDate() + 1)
        let cap = 0
        
        while (cap < 60) {
            if (matchesRecurrence(t, next)) {
                // only insert if it doesn't already exist
                const exists = await pool.query(
                    `SELECT id FROM transactions
                    WHERE user_id = $1 AND recurring_parent_id = $2
                    AND date = $3 LIMIT 1`,
                    [userId, t.id, toDateStringLocal(next)]
                )
                    
                if (exists.rows.length === 0) {
                    await insertOccurrence(t, userId, next)
                }
                
                break
            }
            
            next.setDate(next.getDate() + 1)
            cap++
        }
    }
}

function matchesRecurrence(template, date) {
    if (template.recur_frequency === "weekly") {
        return date.getDay() === template.recur_day_of_week
    }
    if (template.recur_frequency === "monthly") {
        return date.getDate() === template.recur_day_of_month
    }
    return false
}

async function insertOccurrence(template, userId, date) {
    await pool.query(
        `INSERT INTO transactions
         (user_id, amount, type, method, title, category_id, date, mood, intent, notes, recurring_parent_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
            userId,
            template.amount,
            template.type.toLowerCase(),
            template.method.toLowerCase(),
            template.title,
            template.category_id,
            toDateStringLocal(date),
            template.mood,
            template.intent,
            template.notes,
            template.id
        ]
    )
}