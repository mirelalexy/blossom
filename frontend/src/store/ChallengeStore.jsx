import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const ChallengeContext = createContext()

export function ChallengeProvider({ children }) {
    const [challenges, setChallenges] = useState([])
    
        useEffect(() => {
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
                
                        setChallenges(formatted)
                    } catch (err) {
                        console.log("Fetch challenges failed: ", err)
                    }
                }
            
                fetchChallenges()
            }, [])

    return (
        <ChallengeContext.Provider value={{ challenges }}>
            {children}
        </ChallengeContext.Provider>
    )
}

export function useChallenges() {
    return useContext(ChallengeContext)
}