import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import pool from "../db.js"

import { validatePasswordStrength } from "../utils/passwordUtils.js"
import { sendEmailChangedEmail, sendResetPasswordEmail, sendVerificationEmail } from "../utils/emailUtils.js"

import { defaultCategories } from "../config/defaultCategories.js"
import { defaultChallenges } from "../config/defaultChallenges.js"

// verify account token is available for 24 hours
const VERIFY_TOKEN_EXPIRY = 24 * 60 * 60 * 1000

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

        // send a verification email
        try {
            const token = crypto.randomBytes(32).toString("hex")
            const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
            const expiresAt = new Date(Date.now() + VERIFY_TOKEN_EXPIRY)

            await pool.query(
                `UPDATE users
                SET verify_token_hash = $1, verify_token_expires_at = $2
                WHERE id = $3`,
                [tokenHash, expiresAt, userId]
            )

            const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
            await sendVerificationEmail(email, verifyLink)
        } catch (err) {
            console.error("Failed to send a verification email: ", err)
        }

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
            message: "Account created. Check your email to verify it before logging in."
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

        // check if user has verified email
        if (!user.rows[0].email_verified) {
            return res.status(403).json({
                error: "Please verify your email before logging in.",
                code: "EMAIL_NOT_VERIFIED"
            })
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
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY)

        await pool.query(
            `UPDATE users
            SET reset_token_hash = $1, reset_token_expires_at = $2
            WHERE id = $3`,
            [tokenHash, expiresAt, userId]
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

export async function verifyEmail(req, res) {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({ error: "Token is required." })
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

        const userRes = await pool.query(
            `SELECT id FROM users
            WHERE verify_token_hash = $1 AND verify_token_expires_at > NOW()`,
            [tokenHash]
        )

        if (userRes.rows.length === 0) {
            return res.status(400).json({ error: "This verification link is invalid or has expired." })
        }

        const userId = userRes.rows[0].id

        await pool.query(
            `UPDATE users
            SET email_verified = true, verify_token_hash = NULL, verify_token_expires_at = NULL
            WHERE id = $1`,
            [userId]
        )

        res.json({ message: "Email verified." })
    } catch (err) {
        console.error("Verify email failed: ", err)
        res.status(500).json({ error: "Something went wrong. Please try again." })
    }
}

export async function resendVerification(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: "Email is required." })
    }

    // respond with a generic message whether or not the email is verified for privacy reasons
    const response = {
        message: "If that account needs verifying, we've sent a new link."
    }

    try {
        const userRes = await pool.query(
            `SELECT id, email_verified FROM users
            WHERE email = $1`,
            [email]
        )

        if (userRes.rows.length === 0 || userRes.rows[0].email_verified) {
            return res.json(response)
        }

        const userId = userRes.rows[0].id

        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const expiresAt = new Date(Date.now() + VERIFY_TOKEN_EXPIRY)

        await pool.query(
            `UPDATE users
            SET verify_token_hash = $1, verify_token_expires_at = $2
            WHERE id = $3`,
            [tokenHash, expiresAt, userId]
        )

        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
        await sendVerificationEmail(email, verifyLink)

        res.json(response)
    } catch (err) {
        console.error("Resend verification failed: ", err)
        res.json(response)
    }
}

export async function confirmEmailChange(req, res) {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({ error: "Token is required." })
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

        const userRes = await pool.query(
            `SELECT id, email, pending_email FROM users
            WHERE email_change_token_hash = $1 AND email_change_token_expires_at > NOW()`,
            [tokenHash]
        )

        if (userRes.rows.length === 0) {
            return res.status(400).json({ error: "This confirmation link is invalid or has expired." })
        }

        const { id: userId, email: oldEmail, pending_email: newEmail } = userRes.rows[0]

        await pool.query(
            `UPDATE users
            SET email = $1, pending_email = NULL, email_change_token_hash = NULL, email_change_token_expires_at = NULL
            WHERE id = $2`,
            [newEmail, userId]
        )

        try {
            await sendEmailChangedEmail(oldEmail, newEmail)
        } catch (err) {
            console.error("Failed to send email changed notice: ", err)
        }

        res.json({ message: "Email updated.", email: newEmail })
    } catch (err) {
        console.error("Confirm email change failed: ", err)
        res.status(500).json({ error: "Something went wrong. Please try again." })
    }
}