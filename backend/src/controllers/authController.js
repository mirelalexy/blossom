import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import pool from "../db.js"

export async function register(req, res) {
    const { email, password, displayName } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, display_name)
             VALUES ($1, $2, $3)
             RETURNING id, email`,
            [email, hashedPassword, displayName]
        )

        const userId = result.rows[0].id

        const defaultCategories = [
            // expense
            { name: "Bills", type: "expense", icon: "coins" },
            { name: "Food", type: "expense", icon: "apple" },
            { name: "Health", type: "expense", icon: "heartPulse" },
            { name: "Entertainment", type: "expense", icon: "clapperboard" },
            { name: "Shopping", type: "expense", icon: "handbag" },
            { name: "Transport", type: "expense", icon: "car" },
            { name: "Goals", type: "expense", icon: "target" },
            { name: "Other", type: "expense", icon: "circle" },

            // income
            { name: "Salary", type: "income", icon: "briefcase" },
            { name: "Freelance", type: "income", icon: "brush" },
            { name: "Refund", type: "income", icon: "refund" },
            { name: "Gift", type: "income", icon: "gift" },
            { name: "Goals", type: "income", icon: "target" },
            { name: "Other", type: "income", icon: "circle" }
        ]

        for (const cat of defaultCategories) {
            await pool.query(
                `INSERT INTO categories (user_id, name, icon, type, is_default)
                VALUES ($1, $2, $3, $4, true)`,
                [userId, cat.name, cat.icon, cat.type]
            )
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Register failed" })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "User not found" })
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        )

        if (!validPassword) {
            return res.status(400).json({ error: "Wrong password" })
        }

        const token = jwt.sign(
            { userId: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" })
    }
}