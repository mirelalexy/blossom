import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem("token")

            if (!token) return

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
            }
        }

        fetchUser()
    }, [])

    function updateUser(field, value) {
        setUser(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}