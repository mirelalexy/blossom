export function evaluateChallenges({ transactions, streak = 0, budget, challenges }) {
    const expenseTransactions = transactions.filter(t => t.type === "expense")
    const incomeTransactions = transactions.filter(t => t.type === "income")

    const expenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

    // Steady Gardener uses a completion gate (the 25th)
    const today = new Date()
    const isLateInMonth = today.getDate() >= 25

    return challenges.map(c => {
        let progress = 0
        let completed = false

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
                completed = progress >= c.target
                break
            }

            case "streak": {
                progress = Math.min(streak, c.target)
                completed = progress >= c.target
                break
            }

            case "budget": {
                if (!budget?.monthly_limit || budget.monthly_limit <= 0) break

                const limit = Number(budget.monthly_limit)
                const used = expenses / limit

                if (used >= 1) {
                    // over budget
                    progress = Math.round(Math.min(used * 50, 99)) // cap below 100
                    completed = false
                } else {
                    // under budget
                    const dayOfMonth = today.getDate()
                    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
                    const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100)
                    
                    progress = Math.min(monthProgress, 99) // never go to 100 before end of month
                    completed = isLateInMonth && used < 1
                }

                break
            }

            case "expense_count": {
                progress = Math.min(expenseTransactions.length, c.target)
                completed = progress >= c.target
                break
            }

            case "income_count": {
                progress = Math.min(incomeTransactions.length, c.target)
                completed = progress >= c.target
                break
            }

            case "small_expense": {
                const small  = expenseTransactions.filter(t => Number(t.amount) < 50)

                progress = Math.min(small.length, c.target)
                completed = progress >= c.target
                break
            }

            case "big_expense": {
                const big = expenseTransactions.filter(t => Number(t.amount) >= 70)

                progress = Math.min(big.length, c.target)
                completed = progress >= c.target
                break
            }

            case "intent": {
                const matches = expenseTransactions.filter(t => t.intent === c.intent_type)

                progress = Math.min(matches.length, c.target)
                completed = progress >= c.target
                break
            }

            case "method": {
                const matches = expenseTransactions.filter(t => t.method === c.method_type)

                progress = Math.min(matches.length, c.target)
                completed = progress >= c.target
                break
            }

            case "method_tagged": {
                const matches = expenseTransactions.filter(t => t.method === c.method_type && t.mood && t.intent)

                progress = Math.min(matches.length, c.target)
                completed = progress >= c.target
                break
            }

            case "goal_deposit": {
                // evaluate separately in user state utils based on history
                progress = Math.min(c.progress || 0, c.target)
                completed = progress >= c.target
                break
            }

            default:
                break
        }

        return {
            ...c,
            progress,
            completed
        }
    })
}