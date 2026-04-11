export function getStatistics(transactions) {
    if (!transactions || transactions.length === 0) {
        return {
            totalExpenses: 0,
            totalIncome: 0,
            count: 0
        }
    }

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
        totalExpenses,
        totalIncome,
        count: transactions.length
    }
}