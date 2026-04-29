import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
    const { user } = useUser()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    
    async function fetchStats() { 
        try { 
            const res = await apiFetch("/api/profile/stats")
            
            const data = await res.json()
                
            setStats(data)
        } catch (err) {
            console.log("Fetch profile stats failed: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) return

        fetchStats()
    }, [user])

    return (
        <ProfileContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext)
}