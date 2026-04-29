import pool from "../db.js"

export async function getChallenges(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM challenges
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Fetch challenges failed" })
    }
}