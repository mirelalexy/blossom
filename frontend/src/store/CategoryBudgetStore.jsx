import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"

const API_URL = import.meta.env.VITE_API_URL

const CategoryBudgetContext = createContext()

export function CategoryBudgetProvider({ children }) {
    const { user } = useUser()
    const [categoryBudgets, setCategoryBudgets] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchCategoryBudgets() {
            const token = localStorage.getItem("token")
    
            if (!token) return
    
            try {
                const res = await fetch(`${API_URL}/api/category-budgets`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
    
                const data = await res.json()
    
                setCategoryBudgets(data)
            } catch (err) {
                console.log("Fetch category budgets failed: ", err)
            }
        }

        fetchCategoryBudgets()
    }, [user])

    async function updateCategoryBudget(categoryId, amount) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/category-budgets/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
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
            console.log("Update category budget failed: ", err)
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