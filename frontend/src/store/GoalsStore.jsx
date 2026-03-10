import { createContext, useContext, useState, useEffect } from "react"

const GoalsContext = createContext()

function getInitialGoals() {
    const saved = localStorage.getItem("goals")
    return saved ? JSON.parse(saved) : []
}

export function GoalsProvider({ children }) {
    const [goals, setGoals] = useState(getInitialGoals)

    function addGoal(goal) {
        setGoals(prev => [goal, ...prev])
    }

    function deleteGoal(id) {
        setGoals(goals.filter(g => g.id !== id))
    }

    function updateGoalSaved(id, amount) {
        setGoals(goals.map(g => g.id === id ? { ...g, saved: g.saved + amount } : g))
    }

    function withdrawGoalSaved(id, amount) {
        setGoals(goals.map(g => g.id === id ? { ...g, saved: Math.max(0, g.saved - amount) } : g))
    }

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals))
    }, [goals])

    return (
        <GoalsContext.Provider value={{ goals, addGoal, deleteGoal, updateGoalSaved, withdrawGoalSaved }}>
            {children}
        </GoalsContext.Provider>
    )
}

export function useGoals() {
    return useContext(GoalsContext)
}