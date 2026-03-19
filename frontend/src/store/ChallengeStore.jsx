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
        const expenses = transactions
                            .filter(t => t.type === "Expense")
                            .reduce((sum, t) => sum + t.amount, 0)

        setChallenges(prev =>
            prev.map(c => {
                let progress = c.progress

                switch (c.type) {
                    case "mood": {
                        const withMood = transactions.filter(t => t.mood)
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