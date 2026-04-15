import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import pool from "../db.js"

import { defaultCategories } from "../config/defaultCategories.js"
import { defaultChallenges } from "../config/defaultChallenges.js"

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

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        // add default categories
        const categoryValues = defaultCategories.map((_, i) => {
            // each category has 3 fields + skip userId ($1)
            const offset = i * 3 + 2
            return `($1, $${offset}, $${offset + 1}, $${offset + 2}, true)`
        }).join(", ")

        const categoryParams = [
            userId,
            ...defaultCategories.flatMap(c => [c.name, c.icon, c.type])
        ]

        await pool.query(
            `INSERT INTO categories (user_id, name, icon, type, is_default)
            VALUES ${categoryValues}`,
            categoryParams
        )

        // add default challenges
        const challengeValues = defaultChallenges.map((_, i) => {
            // each challenge has 6 fields + skip userId ($1)
            const offset = i * 6 + 2
            return `($1, $${offset}, $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
        }).join(", ")

        const challengeParams = [
            userId,
            ...defaultChallenges.flatMap(c => [
                c.title, c.description, c.type, c.target, c.period, c.mood_type || null
            ])
        ]

        await pool.query(
            `INSERT INTO challenges (user_id, title, description, type, target, period, mood_type)
            VALUES ${challengeValues}`,
            challengeParams
        )

        res.json({
            token,
            user: result.rows[0]
        })
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