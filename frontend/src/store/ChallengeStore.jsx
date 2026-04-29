import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"
import { apiFetch } from "../utils/apiFetch"

const ChallengeContext = createContext()

export function ChallengeProvider({ children }) {
    const { user } = useUser()
    const { showToast } = useToast()
    const [challenges, setChallenges] = useState([])
    const prevChallengesRef = useRef([])

    async function fetchChallenges() {            
        try { 
            const res = await apiFetch("/api/challenges")
            
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
            console.error("Fetch challenges failed: ", err)
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