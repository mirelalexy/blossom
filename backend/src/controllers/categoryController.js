import pool from "../db.js"

export async function getCategories(req, res) {
    const userId = req.user.userId

    try {
        const result = await pool.query(
            `SELECT * FROM categories
            WHERE user_id = $1
            ORDER BY is_default DESC, name ASC`,
            [userId]
        )

        res.json(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Fetch categories failed" })
    }
}

export async function createCategory(req, res) {
    const userId = req.user.userId
    const { name, icon, type } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO categories (user_id, name, icon, type)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, name, icon || "circle", type]
        )

        res.json(result.rows[0])
    } catch (err) {
        if (err.code === "23505") {
            return res.status(500).json({ error: "Category already exists" })
        }

        console.log(err)
        res.status(500).json({ error: "Create category failed" })
    }
}

export async function updateCategory(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { name, icon } = req.body

    try {
        // prevent editing default categories
        const check = await pool.query(
            `SELECT is_default FROM categories WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        if (check.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" })
        }

        if (check.rows[0].is_default) {
            return res.status(400).json({ error: "Cannot edit default category" })
        }

        const result = await pool.query(
            `UPDATE categories
            SET
                name = COALESCE($1, name),
                icon = COALESCE($2, icon)
            WHERE id = $3 AND user_id = $4
            RETURNING *`,
            [name ?? null, icon ?? null, id, userId]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Update category failed" })
    }
}

export async function deleteCategory(req, res) {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const check = await pool.query(
            `SELECT is_default FROM categories WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        if (check.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" })
        }

        if (check.rows[0].is_default) {
            return res.status(400).json({ error: "Cannot delete default category" })
        }

        // find Other category
        const other = await pool.query(
            `SELECT id FROM categories
            WHERE user_id = $1
            AND name = 'Other'
            AND type = $2`,
            [userId, check.rows[0].type]
        )

        // reassign transactions
        await pool.query(
            `UPDATE transactions
            SET category_id = $1
            WHERE category_id = $2`,
            [other.rows[0].id, id]
        )

        await pool.query(
            `DELETE FROM categories
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        )

        res.json({ message: "Deleted successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Delete category failed" })
    }
}