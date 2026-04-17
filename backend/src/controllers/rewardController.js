import pool from "../db.js"

export async function getRewards(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM rewards
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch rewards failed" })
    }
}

export async function createReward(req, res) {
    const userId = req.user.userId
    const { title, taskId, link } = req.body

    if (!title?.trim()) return res.status(400).json({ error: "Title is required" })

    try {
        const result = await pool.query(
            `INSERT INTO rewards (user_id, title, task_id, link)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, title, taskId || null, link || null]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create reward failed" })
    }
}

export async function claimReward(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        // check if reward has already been claimed
        const check = await pool.query(
            `SELECT claimed FROM rewards WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        if (!check.rows.length) {
            return res.status(404).json({ error: "Reward not found" })
        }

        if (check.rows[0].claimed) {
            return res.status(400).json({ error: "Already claimed" })
        }

        const result = await pool.query(
            `UPDATE rewards
            SET
                claimed = true,
                claimed_at = NOW()
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Claim reward failed" })
    }
}

export async function updateReward(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { title, taskId, link } = req.body

    try {
        const result = await pool.query(
            `UPDATE rewards
            SET title = $1,
                task_id = $2,
                link = $3
            WHERE id = $4 AND user_id = $5
            RETURNING *`,
            [title, taskId || null, link || null, id, userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update reward failed" })
    }
}

export async function deleteReward(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        await pool.query(
            `DELETE FROM rewards
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete reward failed" })
    }
}