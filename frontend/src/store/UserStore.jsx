import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user")

        return saved ? JSON.parse(saved) : {
            displayName: "User", 
            email: "user@example.com",
            avatar: "",
            banner: "" 
        }
    })

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])

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