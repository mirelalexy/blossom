import { getMonthKey, getWeekKey, getCurrentMonthKey, getCurrentWeekKey, parseLocalDate, parseDayKeyToUTCDate, getTodayKeyInTimezone } from "./dateUtils.js"

function isInPeriod(transaction, period, tz) {
    if (!transaction.date) return false
    const date = parseLocalDate(transaction.date)

    if (period === "weekly") {
        return getWeekKey(date) === getCurrentWeekKey(tz)
    }

    if (period === "monthly") {
        return getMonthKey(date) === getCurrentMonthKey(tz)
    }

    return true
}

export function evaluateChallenges({ transactions, streak = 0, budget, challenges, goalCategoryId, tz = "UTC" }) {
    // Steady Gardener uses a completion gate (the 25th)
    const today = parseDayKeyToUTCDate(getTodayKeyInTimezone(tz))
    const isLateInMonth = today.getUTCDate() >= 25

    return challenges.map(c => {
        const periodTransactions = transactions.filter(t => isInPeriod(t, c.period, tz))
        const expenseTransactions = periodTransactions.filter(t => t.type === "expense")
        const incomeTransactions = periodTransactions.filter(t => t.type === "income")
        const expenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

        let progress = 0
        let completed = false

        switch (c.type) {
            case "mood": {
                const withMood = periodTransactions.filter(t => {
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
                    const dayOfMonth = today.getUTCDate()
                    const daysInMonth = new Date(Date.UTC(today.getFullUTCYear(), today.getUTCMonth() + 1, 0)).getUTCDate()
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
                const goalDeposits = expenseTransactions.filter(t => t.category_id === goalCategoryId)
                progress = Math.min(goalDeposits.length, c.target)
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