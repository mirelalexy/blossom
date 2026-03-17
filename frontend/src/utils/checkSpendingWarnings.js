export function checkSpendingWarnings({ transaction, transactions, rules, budget }) {
    const warnings = []

    const today = new Date()
    const transactionDate = new Date(transaction.date)

    // check category budget
    if (transaction.type === "Expense") {
        const categoryBudget = budget.categoryBudgets?.[transaction.categoryId] || 0

        if (categoryBudget > 0) {
            const spent = transactions
                .filter(t => {
                    if (!t.date) return false

                    const date = new Date(t.date)

                    return (
                        t.categoryId === transaction.categoryId &&
                        t.type === "Expense" &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                    )
                })
                .reduce((sum, t) => sum + t.amount, 0)

            const newTotal = spent + transaction.amount

            if (newTotal > categoryBudget) {
                warnings.push("This exceeds your category budget.")
            }
        }
     }

     // check rules
    rules.forEach(rule => {
        if (rule.categoryId !== transaction.categoryId) return

        // single transaction limit
        if (rule.type === "single_limit") {
            if (transaction.amount > rule.value) {
                warnings.push("This exceeds your single transaction limit for this category.")
            }
        }

        if (rule.type === "weekly_count") {
            const weekTransactions = transactions.filter(t => {
                const date = new Date(t.date)

                const diffDays = (transactionDate - date) / (1000 * 60 * 60 * 24)

                return (
                    t.categoryId === transaction.categoryId &&
                    t.type === "Expense" &&
                    diffDays >= 0 &&
                    diffDays <= 7
                )
            })

            if (weekTransactions.length >= rule.value) {
                warnings.push("You reached your weekly limit for this category.")
            }
        }
    })

    return warnings
}