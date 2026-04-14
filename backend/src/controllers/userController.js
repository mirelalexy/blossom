import bcrypt from "bcrypt"
import pool from "../db.js"

import { uploadToCloudinary } from "../utils/uploadUtils.js"

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