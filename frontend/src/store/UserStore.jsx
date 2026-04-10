import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchUser() {
        const token = localStorage.getItem("token")

        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            setUser({
                displayName: data.display_name,
                email: data.email,
                avatar: data.avatar,
                banner: data.banner
            })
        } catch (err) {
            console.log("Failed to fetch user: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    async function updateUser(field, value) {
        const token = localStorage.getItem("token")

        setUser(prev => ({
            ...prev,
            [field]: value
        }))

        try {
            await fetch(`${API_URL}/api/users/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            })
        } catch (err) {
            console.log("Update user failed: ", err)
        }
    }

    return (
        <UserContext.Provider value={{ user, updateUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}