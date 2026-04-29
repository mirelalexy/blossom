import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"
import { apiFetch } from "../utils/apiFetch"

const TaskContext = createContext()

export function TaskProvider({ children }) {
    const { user } = useUser()
    const { showToast } = useToast()
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchTasks() {        
            try { 
                const res = await apiFetch("/api/tasks")
        
                const data = await res.json()
                setTasks(data)
            } catch (err) {
                console.log("Fetch tasks failed: ", err)
            }
        }
        
        fetchTasks()
    }, [user])
    
    async function addTask(title) {
        try {
            const res = await apiFetch("/api/tasks", {
                method: "POST",
                body: JSON.stringify({ title })
            })

            const data = await res.json()
            setTasks(prev => [data, ...prev])
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Add task failed: ", err)
        }
    }

    async function toggleTask(id) {
        try {
            const res = await apiFetch(`/api/tasks/${id}`, {
                method: "PATCH"
            })

            const data = await res.json()

            setTasks(prev =>
                prev.map(t => (t.id === id ? data : t))
            )
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Toggle task failed: ", err)
        }
    }

    async function deleteTask(id) {
        try {
            await apiFetch(`/api/tasks/${id}`, {
                method: "DELETE"
            })

            setTasks(prev => prev.filter(t => t.id !== id))

            showToast({ message: "Task deleted" })
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Delete task failed: ", err)
        }        
    }

    async function updateTask(id, title) {
        try {
            const res = await apiFetch(`/api/tasks/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title })
            })

            const data = await res.json()

            setTasks(prev =>
                prev.map(t => (t.id === id ? data : t))
            )
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Update task failed: ", err)
        }
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    )
}

export function useTasks() {
    return useContext(TaskContext)
}