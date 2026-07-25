import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import pool from "../db.js"

import { validatePasswordStrength } from "../utils/passwordUtils.js"
import { sendResetPasswordEmail } from "../utils/emailUtils.js"

import { defaultCategories } from "../config/defaultCategories.js"
import { defaultChallenges } from "../config/defaultChallenges.js"

export async function register(req, res) {
    const { email, password, displayName } = req.body

    if (!email || !password || !displayName) {
        return res.status(400).json({ error: "All fields are required." })
    }

    // validate password strength
    const strengthError = validatePasswordStrength(password)
    if (strengthError) {
        return res.status(400).json({ error: strengthError })
    }

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

        // add notification settings
        await pool.query(
            `INSERT INTO notification_settings
            (user_id, near_budget, exceed_budget, level_up, challenge_complete, log_reminder, recurring_reminder, recurring_frequency)
            VALUES ($1, true, true, true, true, true, true, 'monthly')`,
            [userId]
        )

        res.json({
            token,
            user: result.rows[0]
        })
    } catch (err) {
        console.error(err)
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

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                displayName: user.rows[0].display_name
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
}

// reset password token is available for one hour only
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000

export async function forgotPassword(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: "Email is required." })
    }

    // respond with a generic message whether or not the email is linked to an account for privacy reasons
    const response = {
        message: "If an account with that email exists, I've sent you a reset link."
    }

    try {
        const userRes = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        )

        if (userRes.rows.length === 0) {
            return res.json(response)
        }

        const userId = userRes.rows[0].id

        // generate a random token and hash it before storing
        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY)

        await pool.query(
            `UPDATE users
            SET reset_token_hash = $1, reset_token_expires_at = $2
            WHERE id = $3`,
            [tokenHash, expires, userId]
        )

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

        await sendResetPasswordEmail(email, resetLink)

        res.json(response)
    } catch (err) {
        console.error("Forgot password failed: ", err)
        res.json(response)
    }
}

export async function resetPassword(req, res) {
    const { token, password } = req.body

    if (!token || !password) {
        return res.status(400).json({ error: "Token and new password are required." })
    }

    const strengthError = validatePasswordStrength(password)
    if (strengthError) {
        return res.status(400).json({ error: strengthError })
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

        const userRes = await pool.query(
            `SELECT id FROM users
            WHERE reset_token_hash = $1 AND reset_token_expires_at > NOW()`,
            [tokenHash]
        )

        if (userRes.rows.length === 0) {
            return res.status(400).json({ error: "This reset link is invalid or has expired." })
        }

        const userId = userRes.rows[0].id

        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query(
            `UPDATE users
            SET password_hash = $1, reset_token_hash = NULL, reset_token_expires_at = NULL
            WHERE id = $2`,
            [hashedPassword, userId]
        )

        res.json({ message: "Password updated. You can log in now." })
    } catch (err) {
        console.error("Reset password failed: ", err)
        res.status(500).json({ error: "Something went wrong. Please try again." })
    }
}