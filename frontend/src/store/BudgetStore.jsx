import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const BudgetContext = createContext()

export function BudgetProvider({ children }) {
    const { user } = useUser()
    const [budget, setBudget] = useState(null)

    useEffect(() => {
        if (!user) return

        async function fetchBudget() {    
            try {
                const res = await apiFetch("/api/budget")
    
                const data = await res.json()

                if (!data) {
                    // set default
                    setBudget({
                        monthly_limit: 0,
                        rollover: "none",
                        budget_structure: "total"
                    })

                    return
                }
    
                setBudget({
                    ...data,
                    monthly_limit: Number(data.monthly_limit)
                })
            } catch (err) {
                console.error("Fetch budget failed: ", err)
            }
        }

        fetchBudget()
    }, [user])

    async function saveBudget(updatedBudget) {
        try {
            const res = await apiFetch("/api/budget", {
                method: "PUT",
                body: JSON.stringify(updatedBudget)
            })

            const data = await res.json()

            setBudget({
                ...data,
                monthly_limit: Number(data.monthly_limit)
            })
        } catch (err) {
            console.error("Save budget failed: ", err)
        }
    }

    function updateBudget(field, value) {
        setBudget(prev => {
            const updated = {
                ...prev,
                [field]: value
            }

            // sync
            saveBudget(updated)

            return updated
        })
    }

    return (
        <BudgetContext.Provider value={{ budget, updateBudget }}>
            {children}
        </BudgetContext.Provider>
    )
}

export function useBudget() {
    return useContext(BudgetContext)
}