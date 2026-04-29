import pool from "../db.js"

export async function getNotificationSettings(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM notification_settings
            WHERE user_id = $1`,
            [userId]
        )

        // if no settings, create default row
        if (result.rows.length === 0) {
            const insert = await pool.query(
                `INSERT INTO notification_settings (user_id)
                VALUES ($1)
                RETURNING *`,
                [userId]
            )

            return res.json(insert.rows[0])
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch notification settings" })
    }
}

export async function updateNotificationSettings(req, res) {
    const userId = req.user.userId

    const {
        near_budget,
        exceed_budget,
        level_up,
        challenge_complete,
        log_reminder,
        recurring_reminder,
        recurring_frequency
    } = req.body

    try {
        const result = await pool.query(
            `UPDATE notification_settings
            SET
                near_budget = $1,
                exceed_budget = $2,
                level_up = $3,
                challenge_complete = $4,
                log_reminder = $5,
                recurring_reminder = $6,
                recurring_frequency = $7
            WHERE user_id = $8
            RETURNING *`,
            [
                near_budget,
                exceed_budget,
                level_up,
                challenge_complete,
                log_reminder,
                recurring_reminder,
                recurring_frequency,
                userId
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Notification settings not found" })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Update notification settings failed" })
    }
}