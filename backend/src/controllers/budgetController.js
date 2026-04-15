import pool from "../db.js"
import { parseLocalDate } from "../utils/dateUtils.js"

export async function getBudget(req, res) {
    const userId = req.user.userId

    try {
        const budgetRes = await pool.query(
            `SELECT * FROM budgets WHERE user_id = $1`,
            [userId]
        )

        if (budgetRes.rows.length === 0) {
            return res.json(null)
        }

        const budget = budgetRes.rows[0]

        const currentMonth = new Date().toISOString().slice(0, 7)

        // run rollover only once per month
        if (budget.last_rollover_month !== currentMonth) {
            // get last month
            const now = new Date()
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

            const month = lastMonthDate.getMonth()
            const year = lastMonthDate.getFullYear()

            // get user transactions
            const transactionsRes = await pool.query(
                `SELECT * FROM transactions
                WHERE user_id = $1`,
                [userId]
            )

            const transactions = transactionsRes.rows

            // get expenses from last month
            const lastMonthExpenses = transactions
                .filter(t => {
                    const date = parseLocalDate(t.date)
                    return (
                        t.type === "expense" &&
                        date.getMonth() === month &&
                        date.getFullYear() === year
                    )
                })
                .reduce((sum, t) => sum + Number(t.amount), 0)

            const leftover = Number(budget.monthly_limit) - lastMonthExpenses

            // primary goal rollover
            if (budget.rollover === "primary_goal" && leftover > 0) {
                await pool.query(
                    `UPDATE goals
                    SET current_amount = current_amount + $1
                    WHERE user_id = $2 AND is_primary = true`,
                    [leftover, userId]
                )
            }

            // mark as applied for next month rollover
            await pool.query(
                `UPDATE budgets
                SET last_rollover_month = $1
                WHERE user_id = $2`,
                [currentMonth, userId]
            )
        }

        // if rollover ran, last rollover month changed, so fetch again
        const updatedBudgetRes = await pool.query(
            `SELECT * FROM budgets WHERE user_id = $1`,
            [userId]
        )

        res.json(updatedBudgetRes.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch budget" })
    }
}

export async function upsertBudget(req, res) {
    const userId = req.user.userId

    const {
        monthly_limit,
        rollover,
        budget_structure
    } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO budgets
            (user_id, monthly_limit, rollover, budget_structure)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT(user_id)
            DO UPDATE SET
                monthly_limit = EXCLUDED.monthly_limit,
                rollover = EXCLUDED.rollover,
                budget_structure = EXCLUDED.budget_structure
            RETURNING *`,
            [
                userId,
                monthly_limit,
                rollover,
                budget_structure
            ]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Budget not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Create/update budget failed" })
    }
}