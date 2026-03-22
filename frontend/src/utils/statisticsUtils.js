export function getStatistics(transactions) {
    const today = new Date()

    const monthlyTransactions = transactions.filter(t => {
        if (!t.date) return false

        const date = new Date(t.date)

        return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    })

    if (!monthlyTransactions || monthlyTransactions.length === 0) {
        return {
            totalExpenses: 0,
            totalIncome: 0,
            count: 0
        }
    }

    const totalExpenses = monthlyTransactions
        .filter(t => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalIncome = monthlyTransactions
        .filter(t => t.type === "Income")
        .reduce((sum, t) => sum + t.amount, 0)

    return {
        totalExpenses,
        totalIncome,
        count: monthlyTransactions.length
    }
}