import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"

const API_URL = import.meta.env.VITE_API_URL

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const { user } = useUser()
    const [theme, setTheme] = useState("blossom")

    useEffect(() => {
        if (!user) {
            setTheme("blossom")
            return
        }

        async function fetchTheme() {
            const token = localStorage.getItem("token")
    
            if (!token) return
    
            try { 
                const res = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
    
                const data = await res.json()
        
                setTheme(data.theme || "blossom")
            } catch (err) {
                console.log("Fetch theme failed: ", err)
            }
        }
    
        fetchTheme()
    }, [user])

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    async function updateTheme(newTheme) {
        const token = localStorage.getItem("token")

        // instant UI update then save in DB
        setTheme(newTheme)

        try {
            await fetch(`${API_URL}/api/users/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ theme: newTheme })
            })
        } catch (err) {
            console.log("Update theme failed: ", err)
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}