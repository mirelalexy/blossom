import { createContext, useContext, useState, useEffect } from "react"
import { challenges as initialChallenges } from "../data/challenges"

const ChallengeContext = createContext()

export function ChallengeProvider({ children }) {
    const [challenges, setChallenges] = useState(() => {
        const saved = localStorage.getItem("challenges")
        return saved ? JSON.parse(saved) : initialChallenges
    })

    useEffect(() => {
        localStorage.setItem("challenges", JSON.stringify(challenges))
    }, [challenges])

    function updateChallenge(id, updates) {
        setChallenges(prev => 
            prev.map(c =>
                c.id === id ? { ...c, ...updates } : c
            )
        )
    }

    function evaluateChallenges({ transactions, streak, budget }) {
        const expenseTransactions = transactions.filter(t => t.type === "Expense")
        const incomeTransactions = transactions.filter(t => t.type === "Income")

        const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

        setChallenges(prev =>
            prev.map(c => {
                let progress = 0

                switch (c.type) {
                    case "mood": {
                        const withMood = transactions.filter(t => {
                            if (!t.mood) return false

                            // if specific mood required
                            if (c.moodType) {
                                return t.mood === c.moodType
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
                        if (!budget?.monthlyBudget || budget.monthlyBudget === 0) break

                        const percentUsed = (expenses / budget.monthlyBudget) * 100

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

                    case "small_expense" : {
                        const small  = expenseTransactions.filter(t => t.amount < 50)

                        progress = Math.min(small.length, c.target)
                        break
                    }

                    case "big_expense" : {
                        const big = expenseTransactions.filter(t => t.amount >= 70)

                        progress = Math.min(big.length, c.target)
                        break
                    }

                    default:
                        break
                }

                let completed = progress >= c.target

                if (c.type === "budget") {
                    completed = expenses <= budget.monthlyBudget
                }

                return {
                    ...c,
                    progress,
                    completed
                }
            })
        )
    }

    function rewardCompletedChallenges(addXP) {
        setChallenges(prev =>
            prev.map(c => {
                if (c.completed && !c.rewarded) {
                    addXP()

                    return {
                        ...c,
                        rewarded: true
                    }
                }

                return c
            })
        )
    }

    return (
        <ChallengeContext.Provider value={{ challenges, updateChallenge, evaluateChallenges, rewardCompletedChallenges }}>
            {children}
        </ChallengeContext.Provider>
    )
}

export function useChallenges() {
    return useContext(ChallengeContext)
}