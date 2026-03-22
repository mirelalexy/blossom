import { createContext, useContext, useState, useEffect } from "react"

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("notifications")

        return saved ? JSON.parse(saved) : {
            nearBudget: true,
            exceedBudget: true,
            levelUp: true,
            challengeComplete: true,
            logReminder: true,
            recurringReminder: true,
            frequency: "weekly"
        }
    })

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("notificationFeed")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(settings))
    }, [settings])

    useEffect(() => {
        localStorage.setItem("notificationFeed", JSON.stringify(notifications))
    }, [notifications])

    function updateSetting(field, value) {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }))
    }

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
        <NotificationContext.Provider value={{ settings, updateSetting, notifications, addNotification, cleanOldNotifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    return useContext(NotificationContext)
}