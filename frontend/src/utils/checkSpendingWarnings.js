export function checkSpendingWarnings({ transaction, transactions, rules, budget, categoryBudgets, categories }) {
    const warnings = []

    const today = new Date()
    const transactionDate = new Date(transaction.date)

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
                    t.type === "expense" &&
                    diffDays >= 0 &&
                    diffDays <= 7
                )
            })

            if (weekTransactions.length >= rule.value) {
                warnings.push("You reached your weekly limit for this category.")
            }
        }
    })

    // check category budgets
    if (transaction.type === "expense" && categoryBudgets) {
        const categoryBudget = categoryBudgets.find(
            b => b.category_id === transaction.categoryId
        )

        const limit = categoryBudget ? Number(categoryBudget.monthly_limit) : 0
        
        const category = categories.find(c => c.id === transaction.categoryId)
        const categoryName = category ? category.name : "this category"

        if (limit > 0) {
            const spent = transactions
                .filter(t => {
                    if (!t.date) return false

                    const date = new Date(t.date)

                    return (
                        t.categoryId === transaction.categoryId &&
                        t.type === "expense" &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                    )
                })
                .reduce((sum, t) => sum + Number(t.amount), 0)

            const newTotal = spent + transaction.amount

            if (newTotal > limit) {
                warnings.push(`You exceeded your ${categoryName} budget.`)
            } else if (newTotal > limit * 0.8) {
                warnings.push("You are close to your category budget.")
            }
        }
    }

    // check total budget
    if (transaction.type === "expense" && budget) {
        const monthlyLimit = budget.monthly_limit || 0

        if (monthlyLimit > 0) {
            const spent = transactions
                .filter(t => {
                    if (!t.date) return false

                    const date = new Date(t.date)

                    return (
                        t.type === "expense" &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                    )
                })
                .reduce((sum, t) => sum + Number(t.amount), 0)

            const newTotal = spent + transaction.amount

            if (newTotal > monthlyLimit) {
                warnings.push("You exceeded your monthly budget.")
            } else if (newTotal > monthlyLimit * 0.8) {
                warnings.push("You are close to your monthly budget.")
            }
        }
    }

    return warnings
}