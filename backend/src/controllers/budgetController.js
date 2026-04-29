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

        const now = new Date()
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const last = budget.last_rollover_month

        const isSameMonth =
            last &&
            last.getFullYear() === currentMonth.getFullYear() &&
            last.getMonth() === currentMonth.getMonth()

        // run rollover only once per month
        if (!isSameMonth) {
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

            // monthly deposit to primary goal
            await processAutoGoalDeposits(userId, currentMonth)

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
        console.error(err)
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
        console.error(err)
        res.status(500).json({ error: "Create/update budget failed" })
    }
}

export async function processAutoGoalDeposits(userId, currentMonth) {
    const goalsRes = await pool.query(
        `SELECT * FROM goals
        WHERE user_id = $1
        AND saving_mode = 'auto'
        AND is_completed = false
        AND deadline IS NOT NULL
        AND (last_auto_deposit_month IS NULL OR last_auto_deposit_month != $2)`,
        [userId, currentMonth]
    )

    const now = new Date()

    for (const goal of goalsRes.rows) {
        const deadline = new Date(goal.deadline)
        const remaining = Number(goal.target_amount) - Number(goal.current_amount)

        // skip if already reached
        if (remaining <= 0) continue

        // months remaining (include current month)
        const monthsLeft = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth())

        // skip if past deadline
        if (monthsLeft <= 0) continue

        const monthlyAmount = Math.ceil(remaining / monthsLeft)

        // deposit to goal (cap at remaining)
        const deposit = Math.min(monthlyAmount, remaining)

        await pool.query(
            `UPDATE goals
            SET current_amount = current_amount + $1,
                last_auto_deposit_month = $2
            WHERE id = $3 AND user_id = $4`,
            [deposit, currentMonth, goal.id, userId]
        )

        // find Goals category to log transaction
        const categoryRes = await pool.query(
            `SELECT id FROM categories
            WHERE user_id = $1 AND name = 'Goals' AND type = 'expense' AND is_default = true`,
            [userId]
        )

        if (categoryRes.rows.length === 0) continue

        const categoryId = categoryRes.rows[0].id
        
        const today = now.toISOString().slice(0, 10)

        // create a transaction for deposit
        await pool.query(
            `INSERT INTO transactions
             (user_id, amount, type, method, title, category_id, date, intent, notes)
             VALUES ($1, $2, 'expense', 'card', $3, $4, $5, 'planned', $6)`,
            [
                userId,
                deposit,
                `Auto-saved for ${goal.name}`,
                categoryId,
                today,
                `Blossom auto-deposit: ${monthsLeft} month${monthsLeft === 1 ? "" : "s"} remaining to reach your goal.`
            ]
        )
    }
}