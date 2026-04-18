import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"

const API_URL = import.meta.env.VITE_API_URL

const ChallengeContext = createContext()

export function ChallengeProvider({ children }) {
    const { user } = useUser()
    const { showToast } = useToast()
    const [challenges, setChallenges] = useState([])
    const prevChallengesRef = useRef([])

    async function fetchChallenges() {
        const token = localStorage.getItem("token")
            
        if (!token) return
            
        try { 
            const res = await fetch(`${API_URL}/api/challenges`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const data = await res.json()

            const formatted = data.map(c => ({
                ...c,
                progress: Number(c.progress),
                target: Number(c.target)
            }))

            const prev = prevChallengesRef.current

            formatted.forEach(c => {
                const old = prev.find(p => p.id === c.id)

                if (old && !old.completed && c.completed) {
                    showToast({ message: "Challenge completed" })
                }
            })

            prevChallengesRef.current = formatted
            setChallenges(formatted)
        } catch (err) {
            console.log("Fetch challenges failed: ", err)
        }
    }
    
    useEffect(() => {
        if (!user) return

        fetchChallenges()
    }, [user])

    return (
        <ChallengeContext.Provider value={{ challenges, fetchChallenges }}>
            {children}
        </ChallengeContext.Provider>
    )
}

export function useChallenges() {
    return useContext(ChallengeContext)
}