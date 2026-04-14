import jwt from "jsonwebtoken"
import pool from "../db.js"

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(" ")[1]

    if (!token){
        return res.status(401).json({ error: "No token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // check if user exists
        const userCheck = await pool.query(
            `SELECT id FROM users WHERE id = $1`,
            [decoded.userId]
        )

        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "User no longer exists" })
        }

        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" })
    }
}