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

    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(settings))
    }, [settings])

    function updateSetting(field, value) {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <NotificationContext.Provider value={{ settings, updateSetting }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    return useContext(NotificationContext)
}