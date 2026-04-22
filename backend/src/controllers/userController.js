import bcrypt from "bcrypt"
import pool from "../db.js"
import cloudinary from "../config/cloudinary.js"
import { uploadToCloudinary } from "../utils/uploadUtils.js"

import { defaultChallenges } from "../config/defaultChallenges.js"

export async function getCurrentUser(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT id, display_name, email, avatar, banner, theme, currency, xp, level
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
    const { theme, currency, displayName, email } = req.body

    if (email && !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" })
    }

    try {
        const result = await pool.query(
            `UPDATE users
            SET theme = COALESCE($1, theme),
                currency = COALESCE($2, currency),
                display_name = COALESCE($3, display_name),
                email = COALESCE($4, email)
            WHERE id = $5
            RETURNING *`,
            [
                theme ?? null, 
                currency ?? null, 
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
        console.log(err)
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
        console.log(err)
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
            overwrite: true,
            transformation: [
                { width: 1200, height: 400, crop: "fill" }
            ]
        })

        await pool.query(
            `UPDATE users SET banner = $1 WHERE id = $2`,
            [result.secure_url, userId]
        )

        res.json({ banner: result.secure_url })
    } catch (err) {
        console.log(err)
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
        console.log(err)
        res.status(500).json({ error: "Remove banner failed" })
    }
} 

export async function changePassword(req, res) {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing fields" })
    }

    try {
        // get current password hash
        const userRes = await pool.query(
            `SELECT password_hash FROM users WHERE id = $1`,
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

        res.json({ message: "Password updated successfully" })
    } catch (err) {
        console.log(err)
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
            `SELECT password_hash FROM users WHERE id = $1`,
            [userId]
        )

        const user = userRes.rows[0]

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" })
        }

        await pool.query(
            `DELETE FROM users WHERE id = $1`,
            [userId]
        )

        res.json({ message: "Account deleted successfully" })
    } catch (err) {
        console.log(err)
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

        console.log(err)
        res.status(500).json({ error: "Reset app failed" })
    } finally {
        client.release()
    }
}