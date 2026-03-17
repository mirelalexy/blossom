import { createContext, useContext, useState, useEffect } from "react"

const BudgetContext = createContext()

export function BudgetProvider({ children }) {
    const [budget, setBudget] = useState(() => {
        const saved = localStorage.getItem("budget")

        return saved ? JSON.parse(saved) : {
            monthlyBudget: 4000,
            rollover: "none",
            structure: "total",
            categoryBudgets: {}
        }
    })

    useEffect(() => {
        localStorage.setItem("budget", JSON.stringify(budget))
    }, [budget])

    function updateBudget(field, value) {
        setBudget(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function updateCategoryBudget(categoryId, amount) {
        setBudget(prev => ({
            ...prev,
            categoryBudgets: {
                ...prev.categoryBudgets,
                [categoryId]: Number(amount)
            }
        }))
    }

    return (
        <BudgetContext.Provider value={{ budget, updateBudget, updateCategoryBudget }}>
            {children}
        </BudgetContext.Provider>
    )
}

export function useBudget() {
    return useContext(BudgetContext)
}