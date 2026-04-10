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

export async function updateUserSettings(req, res) {
    const userId = req.user.userId
    const { theme, currency, avatar, banner, displayName, email } = req.body

    if (email && !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" })
    }

    try {
        const result = await pool.query(
            `UPDATE users
            SET theme = COALESCE($1, theme),
                currency = COALESCE($2, currency),
                avatar = COALESCE($3, avatar),
                banner = COALESCE($4, banner),
                display_name = COALESCE($5, display_name),
                email = COALESCE($6, email)
            WHERE id = $7
            RETURNING *`,
            [
                theme ?? null, 
                currency ?? null, 
                avatar ?? null, 
                banner ?? null, 
                displayName ?? null, 
                email ?? null, 
                userId
            ]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update settings failed" })
    }
}