import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"

const API_URL = import.meta.env.VITE_API_URL

const GoalsContext = createContext()

export function GoalsProvider({ children }) {
    const { user } = useUser()
    const { showToast } = useToast()
    const [goals, setGoals] = useState([])

    useEffect(() => {
        if (!user) return
        
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

                const formatted = data.map(g => ({
                    ...g,
                    current_amount: Number(g.current_amount),
                    target_amount: Number(g.target_amount),
                    deadline: g.deadline?.slice(0, 10)
                }))

                setGoals(formatted)
            } catch (err) {
                console.log("Fetch goals failed: ", err)
            }
        }

        fetchGoals()
    }, [user])

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

            showToast({ message: "Goal added" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
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

            showToast({ message: "Goal deleted" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
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

            showToast({ message: "Goal updated" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Update goal failed: ", err)
        }
    }

    // helpers to add/withdraw money
    async function addToGoal(id, amount) {
        const goal = goals.find(g => g.id === id)

        if (!goal) return

        const updatedGoal = {
            ...goal,
            current_amount: Math.min(
                goal.target_amount,
                goal.current_amount + amount
            )
        }

        // update UI instantly then DB
        setGoals(prev =>
            prev.map(g =>
                g.id === id ? updatedGoal : g
            )
        )

        await updateGoal(updatedGoal)
    }

    async function withdrawFromGoal(id, amount) {
        const goal = goals.find(g => g.id === id)

        if (!goal) return

        const updatedGoal = {
            ...goal,
            current_amount: Math.max(
                0,
                goal.current_amount - amount
            )
        }

        // update UI instantly then DB
        setGoals(prev =>
            prev.map(g =>
                g.id === id ? updatedGoal : g
            )
        )

        await updateGoal(updatedGoal)
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