import { createContext, useContext, useState, useEffect } from "react"

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("notificationFeed")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("notificationFeed", JSON.stringify(notifications))
    }, [notifications])

    function addNotification(notification) {
        setNotifications(prev => [
            {
                id: Date.now() + Math.random(),
                createdAt: Date.now(),
                ...notification
            },
            ...prev
        ])
    }

    function cleanOldNotifications() {
        const twoWeeks = 14 * 24 * 60 * 60 * 1000

        setNotifications(prev => prev.filter(n => Date.now() - n.createdAt < twoWeeks))
    }

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, cleanOldNotifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    return useContext(NotificationContext)
}