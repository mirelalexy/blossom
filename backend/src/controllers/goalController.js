import pool from "../db.js"

export async function createGoal(req, res) {
    const userId = req.user.userId

    const {
        name,
        target_amount,
        deadline,
        notes,
        link,
        is_primary
    } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO goals
            (user_id, name, target_amount, deadline, notes, link, is_primary)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                userId,
                name,
                target_amount,
                deadline,
                notes,
                link,
                is_primary || false
            ]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create goal failed" })
    }
}

export async function getGoals(req, res) {
    const userId = req.user.userId
    
    try {
        const result = await pool.query(
            `SELECT * FROM goals
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch goals failed" })
    }
}

export async function updateGoal(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    const {
        name,
        target_amount,
        current_amount,
        deadline,
        notes,
        link,
        is_primary,
        is_completed
    } = req.body

    try {
        const result = await pool.query(
            `UPDATE goals SET
                name = $1,
                target_amount = $2,
                current_amount = $3,
                deadline = $4,
                notes = $5,
                link = $6,
                is_primary = $7,
                is_completed = $8
            WHERE id = $9 AND user_id = $10
            RETURNING *`,
            [
                name,
                target_amount,
                current_amount,
                deadline,
                notes,
                link,
                is_primary,
                is_completed,
                id,
                userId
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Goal not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update goal failed" })
    }
}

export async function deleteGoal(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await pool.query(
            `DELETE FROM goals
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Goal not found" })
        }

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete failed" })
    }
}