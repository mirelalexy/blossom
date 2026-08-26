import bcrypt from "bcrypt"
import crypto from "crypto"
import pool from "../db.js"
import cloudinary from "../config/cloudinary.js"

import { validatePasswordStrength } from "../utils/passwordUtils.js"
import { uploadToCloudinary } from "../utils/uploadUtils.js"
import { sendPasswordChangedEmail, sendEmailChangeConfirmationEmail } from "../utils/emailUtils.js"
import { isValidTimezone } from "../utils/dateUtils.js"

import { defaultChallenges } from "../config/defaultChallenges.js"

export async function getCurrentUser(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT id, display_name, email, avatar, banner, banner_position_y, theme, currency, xp, level, bio, share_bio, email_verified, created_at::text
            FROM users
            WHERE id = $1`,
            [userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch user" })
    }
}

export async function updateUserSettings(req, res) {
    const userId = req.user.userId
    const { theme, currency, displayName, email, bio, shareBio } = req.body

    if (email && !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" })
    }

    if (bio && bio.length > 500) {
        return res.status(400).json({ error: "Bio must be 500 characters or fewer" })
    }

    try {
        const result = await pool.query(
            `UPDATE users
            SET theme = COALESCE($1, theme),
                currency = COALESCE($2, currency),
                display_name = COALESCE($3, display_name),
                email = COALESCE($4, email),
                bio = COALESCE($5, bio),
                share_bio = COALESCE($6, share_bio)
            WHERE id = $7
            RETURNING *`,
            [
                theme ?? null, 
                currency ?? null, 
                displayName ?? null, 
                email ?? null,
                bio ?? null,
                shareBio ?? null, 
                userId
            ]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Update settings failed" })
    }
}

export async function uploadAvatar(req, res) {
    const userId = req.user.userId

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
    }

    try {
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: "blossom/avatars",
            public_id: `avatar_${userId}`,
            overwrite: true,
            transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "face" }
            ]
        })

        await pool.query(
            `UPDATE users SET avatar = $1 WHERE id = $2`,
            [result.secure_url, userId]
        )

        res.json({ avatar: result.secure_url })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Avatar upload failed" })
    }
} 

export async function removeAvatar(req, res) {
    const userId = req.user.userId

    try {
        await cloudinary.uploader.destroy(`blossom/avatars/avatar_${userId}`)

        await pool.query(
            `UPDATE users SET avatar = NULL WHERE id = $1`,
            [userId]
        )

        res.json({ avatar: null })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Remove avatar failed" })
    }
} 

export async function uploadBanner(req, res) {
    const userId = req.user.userId

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
    }

    try {
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: "blossom/banners",
            public_id: `banner_${userId}`,
            overwrite: true
        })

        await pool.query(
            `UPDATE users SET banner = $1, banner_position_y = 50 WHERE id = $2`,
            [result.secure_url, userId]
        )

        res.json({ banner: result.secure_url, bannerPositionY: 50 })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Banner upload failed" })
    }
} 

export async function removeBanner(req, res) {
    const userId = req.user.userId

    try {
        await cloudinary.uploader.destroy(`blossom/banners/banner_${userId}`)

        await pool.query(
            `UPDATE users SET banner = NULL WHERE id = $1`,
            [userId]
        )

        res.json({ banner: null })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Remove banner failed" })
    }
}

export async function updateBannerPosition(req, res) {
    const userId = req.user.userId
    const { positionY } = req.body

    if (typeof positionY !== "number" || positionY < 0 || positionY > 100) {
        return res.status(400).json({ error: "Position Y must be a number between 0 and 100" })
    }

    try {
        await pool.query(
            `UPDATE users SET banner_position_y = $1 WHERE id = $2`,
            [Math.round(positionY), userId]
        )

        res.json({ bannerPositionY: Math.round(positionY) })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update banner position" })
    }
}

export async function changePassword(req, res) {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing fields" })
    }

    // validate password strength
    const strengthError = validatePasswordStrength(newPassword)
    if (strengthError) {
        return res.status(400).json({ error: strengthError })
    }

    try {
        // get current password hash
        const userRes = await pool.query(
            `SELECT email, password_hash FROM users WHERE id = $1`,
            [userId]
        )

        const user = userRes.rows[0]

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // compare passwords
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash)

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password" })
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // update password
        await pool.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [hashedPassword, userId]
        )

        try {
            await sendPasswordChangedEmail(user.email)
        } catch (err) {
            console.error("Failed to send password changed email: ", err)
        }

        res.json({ message: "Password updated successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Change password failed" })
    }
}

export async function deleteAccount(req, res) {
    const userId = req.user.userId
    const { password } = req.body

    if (!password) {
        return res.status(400).json({ error: "Password required" })
    }

    try {
        // get current password hash
        const userRes = await pool.query(
            `SELECT password_hash, avatar, banner FROM users WHERE id = $1`,
            [userId]
        )

        const user = userRes.rows[0]

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" })
        }

        // delete Cloudinary assets before removing DB row
        try {
            if (user.avatar) await cloudinary.uploader.destroy(`blossom/avatars/avatar_${userId}`)
            if (user.banner) await cloudinary.uploader.destroy(`blossom/banners/banner_${userId}`)
        } catch (cdnErr) {
            // proceed with account deletion even if cleanup fails
            console.error("Cloudinary cleanup failed (non-fatal):", cdnErr.message)
        }

        await pool.query(
            `DELETE FROM users WHERE id = $1`,
            [userId]
        )

        res.json({ message: "Account deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Delete account failed" })
    }
}

export async function resetApp(req, res) {
    const userId = req.user.userId
    const { password } = req.body

    if (!password) {
        return res.status(400).json({ error: "Password required to reset your data" })
    }

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // get current password hash
        const userRes = await client.query(
            `SELECT password_hash FROM users WHERE id = $1`,
            [userId]
        )

        const user = userRes.rows[0]

        if (!user) {
            throw new Error("User not found")
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            throw new Error("Incorrect password")
        } 

        // delete all user data
        await client.query(`DELETE FROM notifications WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM tasks WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM rewards WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM transactions WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM goals WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM category_budgets WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM budgets WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM rules WHERE user_id = $1`, [userId])
        await client.query(`DELETE FROM challenges WHERE user_id = $1`, [userId])

        // reset default categories
        await client.query(
            `DELETE FROM categories
            WHERE user_id = $1 AND is_default = false`,
            [userId]
        )

        // reset default notification settings
        await client.query(
            `UPDATE notification_settings
            SET near_budget = true,
                exceed_budget = true,
                level_up = true,
                challenge_complete = true,
                log_reminder = true,
                recurring_reminder = true,
                recurring_frequency = 'monthly'
            WHERE user_id = $1`,
            [userId]
        )

        // reset XP and level
        await client.query(
            `UPDATE users SET xp = 0, level = 1 WHERE id = $1`, 
            [userId]
        )

        // reseed default challenges
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

        await client.query(
            `INSERT INTO challenges (user_id, title, description, type, target, period, mood_type)
            VALUES ${challengeValues}`,
            challengeParams
        )

        await client.query("COMMIT")

        res.json({ message: "App reset successfully" })
    } catch (err) {
        await client.query("ROLLBACK")

        if (err.message === "Incorrect password") {
            return res.status(400).json({ error: err.message })
        }

        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message })
        }

        console.error(err)
        res.status(500).json({ error: "Reset app failed" })
    } finally {
        client.release()
    }
}

// email change confirmation token is available for one hour only
const EMAIL_CHANGE_TOKEN_EXPIRY = 60 * 60 * 1000

export async function requestEmailChange(req, res) {
    const userId = req.user.userId
    const { newEmail, password } = req.body

    if (!newEmail || !newEmail.includes("@")) {
        return res.status(400).json({ error: "A valid new email is required." })
    }

    if (!password) {
        return res.status(400).json({ error: "Password is required to confirm this change." })
    }

    const normalizedEmail = newEmail.trim().toLowerCase()

    try {
        // get current password hash
        const userRes = await pool.query(
            `SELECT email, password_hash FROM users WHERE id = $1`,
            [userId]
        )

        const user = userRes.rows[0]

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" })
        }

        if (normalizedEmail === user.email) {
            return res.status(400).json({ error: "That's already your current email." })
        }

        // make sure no other account already uses this email
        const existing = await pool.query(
            `SELECT id FROM users WHERE email = $1 AND id != $2`,
            [normalizedEmail, userId]
        )

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "That email is already in use." })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const expiresAt = new Date(Date.now() + EMAIL_CHANGE_TOKEN_EXPIRY)

        await pool.query(
            `UPDATE users
            SET pending_email = $1, email_change_token_hash = $2, email_change_token_expires_at = $3
            WHERE id = $4`,
            [normalizedEmail, tokenHash, expiresAt, userId]
        )

        const confirmLink = `${process.env.FRONTEND_URL}/confirm-email-change?token=${token}`
        await sendEmailChangeConfirmationEmail(newEmail, confirmLink)

        res.json({ message: "Check your new email to confirm the change" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Change email request failed" })
    }
}

export async function updateTimezone(req, res) {
    const userId = req.user.userId
    const { timezone } = req.body

    if (!isValidTimezone(timezone)) {
        return res.status(400).json({ error: "Invalid timezone" })
    }

    try {
        await pool.query(
            `UPDATE users SET timezone = $1 WHERE id = $2`,
            [timezone, userId]
        )

        res.json({ timezone })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update timezone" })
    }
}