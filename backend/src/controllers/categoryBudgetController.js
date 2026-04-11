import pool from "../db.js"

export async function getCategoryBudgets(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM category_budgets WHERE user_id = $1`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch category budgets" })
    }
}

export async function upsertCategoryBudget(req, res) {
    const userId = req.user.userId
    const { categoryId } = req.params
    const { monthly_limit } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO category_budgets
            (user_id, category_id, monthly_limit)
            VALUES ($1, $2, $3)
            ON CONFLICT(user_id, category_id)
            DO UPDATE SET
                monthly_limit = EXCLUDED.monthly_limit
            RETURNING *`,
            [
                userId,
                categoryId,
                monthly_limit
            ]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Upsert category budget failed" })
    }
}