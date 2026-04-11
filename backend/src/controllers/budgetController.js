import pool from "../db.js"

export async function getBudget(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM budgets WHERE user_id = $1`,
            [userId]
        )

        if (result.rows.length === 0) {
            return res.json(null)
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch budget" })
    }
}

export async function upsertBudget(req, res) {
    const userId = req.user.userId

    const {
        monthly_limit,
        rollover,
        budget_structure
    } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO budgets
            (user_id, monthly_limit, rollover, budget_structure)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT(user_id)
            DO UPDATE SET
                monthly_limit = EXCLUDED.monthly_limit,
                rollover = EXCLUDED.rollover,
                budget_structure = EXCLUDED.budget_structure
            RETURNING *`,
            [
                userId,
                monthly_limit,
                rollover,
                budget_structure
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Budget not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create/update budget failed" })
    }
}