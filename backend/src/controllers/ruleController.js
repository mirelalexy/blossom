import pool from "../db.js"

export async function getRules(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM rules
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch rules failed" })
    }
}

export async function createRule(req, res) {
    const userId = req.user.userId
    const { category_id, type, value } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO rules (user_id, category_id, type, value)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, category_id, type, value]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create rule failed" })
    }
}

export async function updateRule(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { category_id, type, value } = req.body

    try {
        const result = await pool.query(
            `UPDATE rules
            SET
                category_id= $1,
                type = $2,
                value = $3
            WHERE id = $4 AND user_id = $5
            RETURNING *`,
            [category_id, type, value, id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Rule not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update rule failed" })
    }
}

export async function deleteRule(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await pool.query(
            `DELETE FROM rules
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Rule not found" })
        }

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete rule failed" })
    }
}