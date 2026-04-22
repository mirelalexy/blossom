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

            if (res.status === 401) {
                localStorage.removeItem("token")
                setUser(null)
                setLoading(false)
                return
            }

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

    async function uploadAvatar(file) {
        const token = localStorage.getItem("token")

        const formData = new FormData()
        formData.append("image", file)

        const res = await fetch (`${API_URL}/api/users/avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })

        const data = await res.json()

        setUser(prev => ({
            ...prev,
            avatar: data.avatar
        }))

        return data.avatar
    }

    async function removeAvatar() {
        const token = localStorage.getItem("token")

        const res = await fetch (`${API_URL}/api/users/avatar`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error("Remove avatar failed")
        }

        setUser(prev => ({
            ...prev,
            avatar: null
        }))
    }

    async function uploadBanner(file) {
        const token = localStorage.getItem("token")

        const formData = new FormData()
        formData.append("image", file)

        const res = await fetch (`${API_URL}/api/users/banner`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })

        const data = await res.json()

        setUser(prev => ({
            ...prev,
            banner: data.banner
        }))

        return data.banner
    }

    async function removeBanner() {
        const token = localStorage.getItem("token")

        const res = await fetch (`${API_URL}/api/users/banner`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error("Remove banner failed")
        }

        setUser(prev => ({
            ...prev,
            banner: null
        }))
    }

    async function changePassword(currentPassword, newPassword) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/users/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Change password failed")
            }

            return data
        } catch (err) {
            console.log("Change password failed: ", err)
            throw err
        }
    } 

    async function deleteAccount(password) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/users/account`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Delete account failed")
            }

            // log out
            localStorage.removeItem("token")

            return data
        } catch (err) {
            console.log("Delete account failed: ", err)
            throw err
        }
    }

    async function resetApp(password) {
        const token = localStorage.getItem("token")

        if (!token) return

        try {
            const res = await fetch(`${API_URL}/api/users/reset-app`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Reset failed")
            }

            window.location.reload()
        } catch (err) {
            console.log("Reset app failed: ", err)
            throw err
        }
    }

    function logout() {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, updateUser, fetchUser, loading, uploadAvatar, removeAvatar, uploadBanner, removeBanner, changePassword, deleteAccount, resetApp, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}