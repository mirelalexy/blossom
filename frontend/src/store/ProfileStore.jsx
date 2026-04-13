import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    
    async function fetchStats() {
        const token = localStorage.getItem("token")
            
        if (!token) return
            
        try { 
            const res = await fetch(`${API_URL}/api/profile/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const data = await res.json()
                
            setStats(data)
        } catch (err) {
            console.log("Fetch profile stats failed: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return (
        <ProfileContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext)
}