export function calculateBudgetWithRollover({ transactions, budget }) {
    if (!budget) return 0

    const base = Number(budget.monthly_limit) || 0

    // only apply if rollover is set to next month
    if (budget.rollover !== "next_month") {
        return base
    }

    const now = new Date()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const month = lastMonthDate.getMonth()
    const year = lastMonthDate.getFullYear()

    // get transactions from last month
    const lastMonthTransactions = transactions.filter(t => {
        if (!t.date) return false

        const date = new Date(t.date)

        return (
            date.getMonth() === month &&
            date.getFullYear() === year
        )
    })

    if (lastMonthTransactions.length === 0) {
        return base
    }

    const lastMonthExpenses = lastMonthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const leftover = base - lastMonthExpenses

    return leftover > 0 ? base + leftover : base
}