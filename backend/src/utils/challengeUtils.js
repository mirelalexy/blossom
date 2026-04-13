export function evaluateChallenges({ transactions, streak = 0, budget, challenges }) {
    const expenseTransactions = transactions.filter(t => t.type === "expense")
    const incomeTransactions = transactions.filter(t => t.type === "income")

    const expenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

    return challenges.map(c => {
        let progress = 0

        switch (c.type) {
            case "mood": {
                const withMood = transactions.filter(t => {
                    if (!t.mood) return false

                    // if specific mood required
                    if (c.mood_type) {
                        return t.mood === c.mood_type
                    }

                    return true
                })
                        
                progress = Math.min(withMood.length, c.target)
                break
            }

            case "streak": {
                progress = Math.min(streak, c.target)
                break
            }

            case "budget": {
                if (!budget?.monthly_limit) break

                const percentUsed = (expenses / budget.monthly_limit) * 100

                progress = Math.min(percentUsed, c.target)
                break
            }

            case "expense_count": {
                progress = Math.min(expenseTransactions.length, c.target)
                break
            }

            case "income_count": {
                progress = Math.min(incomeTransactions.length, c.target)
                break
            }

            case "small_expense": {
                const small  = expenseTransactions.filter(t => Number(t.amount) < 50)

                progress = Math.min(small.length, c.target)
                break
            }

            case "big_expense": {
                const big = expenseTransactions.filter(t => Number(t.amount) >= 70)

                progress = Math.min(big.length, c.target)
                break
            }

            case "mood_all": {
                const total = transactions.length
                const withMood = transactions.filter(t => t.mood).length

                progress = total === 0 ? 0 : (withMood / total) * 100
                break
            }

            default:
                break
        }

        let completed = progress >= c.target

        if (c.type === "budget") {
            completed = expenses > 0 && expenses <= budget?.monthly_limit
        }

        return {
            ...c,
            progress,
            completed
        }
    })
}