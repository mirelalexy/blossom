import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const CategoryBudgetContext = createContext()

export function CategoryBudgetProvider({ children }) {
    const { user } = useUser()
    const [categoryBudgets, setCategoryBudgets] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchCategoryBudgets() {    
            try {
                const res = await apiFetch("/api/category-budgets")
    
                const data = await res.json()
    
                setCategoryBudgets(data)
            } catch (err) {
                console.error("Fetch category budgets failed: ", err)
            }
        }

        fetchCategoryBudgets()
    }, [user])

    async function updateCategoryBudget(categoryId, amount) {
        try {
            const res = await apiFetch(`/api/category-budgets/${categoryId}`, {
                method: "PUT",
                body: JSON.stringify({
                    monthly_limit: Number(amount)
                })
            })

            const data = await res.json()

            setCategoryBudgets(prev => {
                const exists = prev.find(b => b.category_id === categoryId)
                
                if (exists) {
                    return prev.map(b =>
                        b.category_id === categoryId ? data : b
                    )
                }

                return [...prev, data]
            })
        } catch (err) {
            console.error("Update category budget failed: ", err)
        }
    }

    return (
        <CategoryBudgetContext.Provider value={{ categoryBudgets, updateCategoryBudget }}>
            {children}
        </CategoryBudgetContext.Provider>
    )
}

export function useCategoryBudgets() {
    return useContext(CategoryBudgetContext)
}