import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    async function fetchNotifications() {
        const token = localStorage.getItem("token")
        
        if (!token) return
        
        try { 
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        
            const data = await res.json()
            
            setNotifications(data)
        } catch (err) {
            console.log("Fetch notifications failed: ", err)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    async function addNotification(notification, eventKey = null) {
        const token = localStorage.getItem("token")
        
        // guard to prevent spam before request
        if (eventKey) {
            const alreadyExists = notifications.some(n => n.event_key === eventKey)
            if (alreadyExists) return
        }

        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...notification, eventKey })
            })

            const data = await res.json()

            setNotifications(prev => [...prev, data])
        } catch (err) {
            console.log("Add notification failed: ", err)
        }
    }

    async function markAsRead(id) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/notifications/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setNotifications(prev =>
                prev.map(n =>
                    n.id === id ? {...n, read: true} : n
                )
            )
        } catch (err) {
            console.log("Mark as read failed: ", err)
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    return useContext(NotificationContext)
}