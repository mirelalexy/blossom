import pool from "../db.js"

export async function getNotifications(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch notifications failed" })
    }
}

export async function createNotification(req, res) {
    const userId = req.user.userId
    const { type, title, message, eventKey } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, event_key)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, event_key) DO NOTHING
            RETURNING *`,
            [userId, type, title, message, eventKey || null]
        )

        // if duplicate, fetch existing one
        if (result.rows.length === 0 && eventKey) {
            const existing = await pool.query(
                `SELECT * FROM notifications
                WHERE user_id = $1 AND event_key = $2`,
                [userId, eventKey]
            )

            return res.json(existing.rows[0])
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create notification failed" })
    }
}

export async function markAsRead(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await pool.query(
            `UPDATE notifications
            SET read = true
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Notification not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update notification failed" })
    }
}