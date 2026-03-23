export function getStatistics(transactions) {
    if (!transactions || transactions.length === 0) {
        return {
            totalExpenses: 0,
            totalIncome: 0,
            count: 0
        }
    }

    const totalExpenses = transactions
        .filter(t => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalIncome = transactions
        .filter(t => t.type === "Income")
        .reduce((sum, t) => sum + t.amount, 0)

    return {
        totalExpenses,
        totalIncome,
        count: transactions.length
    }
}