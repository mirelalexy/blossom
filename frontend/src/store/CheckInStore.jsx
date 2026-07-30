import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"

import { useAppRefresh } from "../hooks/useAppRefresh"
import { apiFetch } from "../utils/apiFetch"

const CheckInContext = createContext()

export function CheckInProvider({ children }) {
    const { user } = useUser()
    const { showToast, showXPToast } = useToast()
    const { refreshApp } = useAppRefresh()

    const [todayCheckIn, setTodayCheckIn] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchTodayCheckIn() {
        setLoading(true)

        try {
            const res = await apiFetch("/api/check-ins/today")
            const data = await res.json()

            setTodayCheckIn(data)
        } catch (err) {
            console.error("Fetch today's check-in failed: ", err)
        } finally {
            setLoading(false)
        }
    }

    async function addCheckIn(mood, notes) {
        try {
            const res = await apiFetch("/api/check-ins", {
                method: "POST",
                body: JSON.stringify({ mood, notes })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Check-in failed")
            }

            setTodayCheckIn(data)
            showToast({ message: "Checked in for today" })
            showXPToast(data.xp)

            refreshApp()
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.error("Add check-in failed: ", err)
        }
    }

    useEffect(() => {
        if (user) fetchTodayCheckIn()
    }, [user])

    return (
        <CheckInContext.Provider value={{ todayCheckIn, loading, addCheckIn, fetchTodayCheckIn }}>
            {children}
        </CheckInContext.Provider>
    )
}

export function useCheckIn() {
    return useContext(CheckInContext)
}