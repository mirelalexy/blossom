import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"

const API_URL = import.meta.env.VITE_API_URL

const TaskContext = createContext()

export function TaskProvider({ children }) {
    const { user } = useUser()
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchTasks() {
            const token = localStorage.getItem("token")
        
            if (!token) return
        
            try { 
                const res = await fetch(`${API_URL}/api/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        
                const data = await res.json()
                setTasks(data)
            } catch (err) {
                console.log("Fetch tasks failed: ", err)
            }
        }
        
        fetchTasks()
    }, [user])
    
    async function addTask(title) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            })

            const data = await res.json()
            setTasks(prev => [data, ...prev])
        } catch (err) {
            console.log("Add task failed: ", err)
        }
    }

    async function toggleTask(id) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setTasks(prev =>
                prev.map(t => (t.id === id ? data : t))
            )
        } catch (err) {
            console.log("Toggle task failed: ", err)
        }
    }

    async function deleteTask(id) {
        const token = localStorage.getItem("token")

        try {
            await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setTasks(prev => prev.filter(r => r.id !== id))
        } catch (err) {
            console.log("Delete task failed: ", err)
        }        
    }

    async function updateTask(id, title) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            })

            const data = await res.json()

            setTasks(prev =>
                prev.map(t => (t.id === id ? data : t))
            )
        } catch (err) {
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