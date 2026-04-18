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
    const { title, amount, taskId, link } = req.body

    if (!title?.trim()) return res.status(400).json({ error: "Title is required" })
    
    const cleanAmount = amount ? Number(amount) : null

    try {
        const result = await pool.query(
            `INSERT INTO rewards (user_id, title, amount, task_id, link)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [userId, title, cleanAmount, taskId || null, link || null]
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
        // start safe block to undo if something fails
        await pool.query("BEGIN")

        // check if reward has already been claimed
        const rewardRes = await pool.query(
            `SELECT * FROM rewards WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        const reward = rewardRes.rows[0]

        if (!reward) {
            await pool.query("ROLLBACK")
            return res.status(404).json({ error: "Reward not found" })
        }

        if (reward.claimed) {
            await pool.query("ROLLBACK")
            return res.status(400).json({ error: "Already claimed" })
        }

        let transactionId = null

        // create transaction if amount exists
        if (reward.amount) {
            // find Rewards category ID
            const categoryRes = await pool.query(
                `SELECT id FROM categories WHERE name = $1 AND user_id = $2`,
                ["Rewards", userId]
            )

            const category = categoryRes.rows[0].id

            if (!category) {
                await pool.query("ROLLBACK")
                return res.status(404).json({ error: "Category not found" })
            }

            const transactionRes = await pool.query(
                `INSERT INTO transactions
                (user_id, amount, type, method, title, date, category_id)
                VALUES ($1, $2, 'expense', 'card', $3, NOW(), $4)
                RETURNING id`,
                [userId, reward.amount, `Claimed reward: ${reward.title}`, category]
            )

            transactionId = transactionRes.rows[0].id
        }

        const result = await pool.query(
            `UPDATE rewards
            SET
                claimed = true,
                claimed_at = NOW(),
                transaction_id = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *`,
            [transactionId, id, userId]
        )

        await pool.query("COMMIT")

        res.json(result.rows[0])
    } catch (err) {
        await pool.query("ROLLBACK")
        console.log(err)
        res.status(500).json({ error: "Claim reward failed" })
    }
}

export async function updateReward(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { title, taskId, link, amount } = req.body

    if (!title?.trim()) return res.status(400).json({ error: "Title is required" })

    const cleanAmount = amount ? Number(amount) : null

    try {
        const result = await pool.query(
            `UPDATE rewards
            SET title = $1,
                task_id = $2,
                link = $3,
                amount = $4
            WHERE id = $5 AND user_id = $6
            RETURNING *`,
            [title, taskId || null, link || null, cleanAmount, id, userId]
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