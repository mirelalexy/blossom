import { createContext, useContext, useState, useEffect } from "react"
import { apiFetch } from "../utils/apiFetch"

const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchUser() {
        setLoading(true)

        try {
            const res = await apiFetch("/api/users/me")

            const data = await res.json()

            setUser({
                displayName: data.display_name,
                email: data.email,
                avatar: data.avatar,
                banner: data.banner
            })
        } catch (err) {
            console.log("Failed to fetch user: ", err)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    async function updateUser(field, value) {
        const prevUser = user

        setUser(prev => ({
            ...prev,
            [field]: value
        }))

        try {
            await apiFetch("/api/users/settings", {
                method: "PUT",
                body: JSON.stringify({ [field]: value })
            })
        } catch (err) {
            console.log("Update user failed: ", err)
            setUser(prevUser) // rollback
        }
    }

    async function uploadAvatar(file) {
        const formData = new FormData()
        formData.append("image", file)

        const res = await apiFetch("/api/users/avatar", {
            method: "POST",
            body: formData
        })

        if (!res.ok) {
            throw new Error("Upload failed")
        }

        const data = await res.json()

        setUser(prev => ({
            ...prev,
            avatar: data.avatar
        }))

        return data.avatar
    }

    async function removeAvatar() {
        const res = await apiFetch("/api/users/avatar", {
            method: "DELETE"
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
        const formData = new FormData()
        formData.append("image", file)

        const res = await apiFetch("/api/users/banner", {
            method: "POST",
            body: formData
        })

        if (!res.ok) {
            throw new Error("Upload failed")
        }

        const data = await res.json()

        setUser(prev => ({
            ...prev,
            banner: data.banner
        }))

        return data.banner
    }

    async function removeBanner() {
        const res = await apiFetch("/api/users/banner", {
            method: "DELETE"
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
        try {
            const res = await apiFetch("/api/users/password", {
                method: "PATCH",
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
        try {
            const res = await apiFetch("/api/users/account", {
                method: "DELETE",
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
        try {
            const res = await apiFetch("/api/users/reset-app", {
                method: "POST",
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