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