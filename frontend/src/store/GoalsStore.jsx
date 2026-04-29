import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"
import { apiFetch } from "../utils/apiFetch"

const GoalsContext = createContext()

export function GoalsProvider({ children }) {
    const { user } = useUser()
    const { showToast } = useToast()
    const [goals, setGoals] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setGoals([])
            setLoading(false)
            return
        }
        
        async function fetchGoals() {
            setLoading(true)

            try {
                const res = await apiFetch("/api/goals")

                const data = await res.json()

                const formatted = data.map(g => ({
                    ...g,
                    current_amount: Number(g.current_amount),
                    target_amount: Number(g.target_amount),
                    deadline: g.deadline?.slice(0, 10)
                }))

                setGoals(formatted)
            } catch (err) {
                console.error("Fetch goals failed: ", err)
            } finally {
                setLoading(false)
            }
        }

        fetchGoals()
    }, [user])

    async function addGoal(goal) {
        try {
            const res = await apiFetch("/api/goals", {
                method: "POST",
                body: JSON.stringify(goal)
            })

            const data = await res.json()
            setGoals(prev => [data, ...prev])

            showToast({ message: "Goal added" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.error("Add goal failed: ", err)
        }
    }

    async function deleteGoal(id) {
        try {
            await apiFetch(`/api/goals/${id}`, {
                method: "DELETE",
            })

            setGoals(prev => prev.filter(g => g.id !== id))

            showToast({ message: "Goal deleted" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.error("Delete goal failed: ", err)
        }        
    }

    async function updateGoal(goal) {
        try {
            const res = await apiFetch(`/api/goals/${goal.id}`, {
                method: "PUT",
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
            console.error("Update goal failed: ", err)
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
        <GoalsContext.Provider value={{ goals, loading, addGoal, deleteGoal, updateGoal, addToGoal, withdrawFromGoal }}>
            {children}
        </GoalsContext.Provider>
    )
}

export function useGoals() {
    return useContext(GoalsContext)
}