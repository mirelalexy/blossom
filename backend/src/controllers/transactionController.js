import pool from "../db.js"

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
            RETURNING *`,
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
            `SELECT * FROM transactions
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
            RETURNING *`,
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