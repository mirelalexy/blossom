import pool from "../db.js"

export async function createSystemNotification({ userId, type, title, message, eventKey = null }) {
    try {
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, event_key)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, event_key) DO NOTHING`,
            [userId, type, title, message, eventKey]
        )
    } catch (err) {
        console.error("Create notification failed: ", err)
    }
}