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

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals))
    }, [goals])

    return (
        <GoalsContext.Provider value={{ goals, addGoal, deleteGoal }}>
            {children}
        </GoalsContext.Provider>
    )
}

export function useGoals() {
    return useContext(GoalsContext)
}