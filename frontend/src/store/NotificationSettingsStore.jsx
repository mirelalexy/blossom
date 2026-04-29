import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const NotificationSettingsContext = createContext()

export function NotificationSettingsProvider({ children }) {
    const { user } = useUser()
    const [notificationSettings, setNotificationSettings] = useState(null)

    useEffect(() => {
        if (!user) return
        
        async function fetchNotificationSettings() {
            const token = localStorage.getItem("token")
        
            if (!token) return
        
            try { 
                const res = await apiFetch("/api/notification-settings")
        
                const data = await res.json()
            
                setNotificationSettings(data)
            } catch (err) {
                console.log("Fetch notification settings failed: ", err)
            }
        }
        
        fetchNotificationSettings()
    }, [user])

    async function updateNotificationSetting(field, value) {
        if (!notificationSettings) return

        const token = localStorage.getItem("token")

        // instant UI update then save in DB
        const updated = { ...notificationSettings, [field]: value }
        setNotificationSettings(updated)

        await apiFetch("/api/notification-settings", {
            method: "PUT",
            body: JSON.stringify(updated)
        })
    }

    return (
        <NotificationSettingsContext.Provider value={{ notificationSettings, updateNotificationSetting }}>
            {children}
        </NotificationSettingsContext.Provider>
    )
}

export function useNotificationSettings() {
    return useContext(NotificationSettingsContext)
}