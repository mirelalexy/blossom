import pool from "../db.js"

export async function getPendingInsight(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT id, message, created_at
            FROM proactive_insights
            WHERE user_id = $1 AND seen_at IS NULL
            ORDER BY created_at DESC
            LIMIT 1`,
            [userId]
        )
        
        res.json(result.rows[0] || null)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch pending insight" })
    }
}

export async function markInsightSeen(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await pool.query(
            `UPDATE proactive_insights
            SET seen_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING id`,
            [id, userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Insight not found" })
        }

        res.json({ message: "Insight marked as seen" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update insight" })
    }
}

