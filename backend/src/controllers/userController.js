import pool from "../db.js"

export async function getCurrentUser(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT id, display_name, email, avatar, banner, theme, currency
            FROM users
            WHERE id = $1`,
            [userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch user" })
    }
}