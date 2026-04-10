import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const GoalsContext = createContext()

export function GoalsProvider({ children }) {
    const [goals, setGoals] = useState([])

    useEffect(() => {
        async function fetchGoals() {
            const token = localStorage.getItem("token")

            if (!token) return

            try {
                const res = await fetch(`${API_URL}/api/goals`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await res.json()
                setGoals(data)
            } catch (err) {
                console.log("Fetch goals failed: ", err)
            }
        }

        fetchGoals()
    }, [])

    async function addGoal(goal) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/goals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(goal)
            })

            const data = await res.json()
            setGoals(prev => [data, ...prev])
        } catch (err) {
            console.log("Add goal failed: ", err)
        }
    }

    async function deleteGoal(id) {
        const token = localStorage.getItem("token")

        try {
            await fetch(`${API_URL}/api/goals/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            setGoals(prev => prev.filter(g => g.id !== id))
        } catch (err) {
            console.log("Delete goal failed: ", err)
        }        
    }

    async function updateGoal(goal) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/goals/${goal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(goal)
            })

            const data = await res.json()

            setGoals(prev => 
                prev.map(g =>
                    g.id === data.id ? data : g
                )
            )
        } catch (err) {
            console.log("Update goal failed: ", err)
        }
    }

    // helpers to add/withdraw money
    async function addToGoal(id, amount) {
        const goal = goals.find(g => g.id === id)
        
        if (!goal) return

        const updated = {
            ...goal,
            current_amount: Math.min(
                goal.target_amount,
                goal.current_amount + amount
            )
        }

        await updateGoal(updated)
    }

    async function withdrawFromGoal(id, amount) {
        const goal = goals.find(g => g.id === id)
        
        if (!goal) return

        const updated = {
            ...goal,
            current_amount: Math.max(
                0,
                goal.current_amount - amount
            )
        }

        await updateGoal(updated)
    }

    return (
        <GoalsContext.Provider value={{ goals, addGoal, deleteGoal, updateGoal, addToGoal, withdrawFromGoal }}>
            {children}
        </GoalsContext.Provider>
    )
}

export function useGoals() {
    return useContext(GoalsContext)
}