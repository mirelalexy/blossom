import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState({ displayName: "", email: "" })

    useEffect(() => {
        const savedUser = localStorage.getItem("user")

        if (savedUser) {
            setUser(JSON.parse(savedUser))
        } else {
            const defaultUser = {
                displayName: "User",
                email: "user@gmail.com"
            }

            setUser(defaultUser)
            localStorage.getItem("user", JSON.stringify(defaultUser))
        }
    }, [])

    function updateUser(field, value) {
        const updated = {
            ...user,
            [field]: value
        }

        setUser(updated)
        localStorage.getItem("user", JSON.stringify(updated))
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