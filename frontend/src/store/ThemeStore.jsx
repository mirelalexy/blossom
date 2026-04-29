import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const { user } = useUser()
    const [theme, setTheme] = useState("blossom")

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    useEffect(() => {
        if (!user) {
            setTheme("blossom")
            document.documentElement.setAttribute("data-theme", "blossom")
            return
        }

        async function fetchTheme() {    
            try { 
                const res = await apiFetch("/api/users/me")
    
                const data = await res.json()
        
                setTheme(data.theme || "blossom")
            } catch (err) {
                console.error("Fetch theme failed: ", err)
            }
        }
    
        fetchTheme()
    }, [user])

    async function updateTheme(newTheme) {
        // instant UI update then save in DB
        setTheme(newTheme)

        try {
            await apiFetch("/api/users/settings", {
                method: "PUT",
                body: JSON.stringify({ theme: newTheme })
            })
        } catch (err) {
            console.error("Update theme failed: ", err)
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