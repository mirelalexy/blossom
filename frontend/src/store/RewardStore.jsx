import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"

const API_URL = import.meta.env.VITE_API_URL

const RewardContext = createContext()

export function RewardProvider({ children }) {
    const { user } = useUser()
    const [rewards, setRewards] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchRewards() {
            const token = localStorage.getItem("token")
        
            if (!token) return
        
            try { 
                const res = await fetch(`${API_URL}/api/rewards`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        
                const data = await res.json()
                setRewards(data)
            } catch (err) {
                console.log("Fetch rewards failed: ", err)
            }
        }
        
        fetchRewards()
    }, [user])
    
    async function addReward({ title, taskId, link, amount }) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/rewards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, taskId, link, amount })
            })

            const data = await res.json()
            setRewards(prev => [data, ...prev])
        } catch (err) {
            console.log("Add reward failed: ", err)
        }
    }

    async function claimReward(id) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/rewards/${id}/claim`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setRewards(prev =>
                prev.map(r => (r.id === id ? data : r))
            )
        } catch (err) {
            console.log("Claim reward failed: ", err)
        }
    }

    async function deleteReward(id) {
        const token = localStorage.getItem("token")

        try {
            await fetch(`${API_URL}/api/rewards/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setRewards(prev => prev.filter(r => r.id !== id))
        } catch (err) {
            console.log("Delete reward failed: ", err)
        }        
    }

    async function updateReward(id, updates) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/rewards/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            })

            const data = await res.json()

            setRewards(prev =>
                prev.map(r => (r.id === id ? data : r))
            )
        } catch (err) {
            console.log("Update reward failed: ", err)
        }
    }

    return (
        <RewardContext.Provider value={{ rewards, addReward, updateReward, claimReward, deleteReward }}>
            {children}
        </RewardContext.Provider>
    )
}

export function useRewards() {
    return useContext(RewardContext)
}