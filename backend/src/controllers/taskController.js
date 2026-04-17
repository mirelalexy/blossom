import pool from "../db.js"

export async function getTasks(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM tasks
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch tasks failed" })
    }
}

export async function createTask(req, res) {
    const userId = req.user.userId
    const { title } = req.body

    if (!title?.trim()) return res.status(400).json({ error: "Title is required" })

    try {
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, title]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create task failed" })
    }
}

export async function toggleTask(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET
                completed = NOT completed,
                completed_at = CASE
                    WHEN completed = false THEN NOW()
                    ELSE NULL
                END
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Toggle task failed" })
    }
}

export async function updateTask(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { title } = req.body

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET title = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *`,
            [title, id, userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update task failed" })
    }
}

export async function deleteTask(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        await pool.query(
            `DELETE FROM tasks
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete task failed" })
    }
}