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
                id: data.id,
                displayName: data.display_name,
                email: data.email,
                avatar: data.avatar,
                banner: data.banner,
                bannerPositionY: data.banner_position_y,
                bio: data.bio,
                shareBio: data.share_bio,
                createdAt: data.created_at,
                timezone: data.timezone
            })

            // update timezone if necessary
            const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

            if (detectedTimezone && detectedTimezone !== data.timezone) {
                try {
                    await apiFetch("/api/users/timezone", {
                        method: "PATCH",
                        body: JSON.stringify({ timezone: detectedTimezone })
                    })
                } catch (err) {
                    console.error("Failed to sync timezone: ", err)
                }
            }
        } catch (err) {
            console.error("Failed to fetch user: ", err)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) {
            setLoading(false)
            return
        }
        
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
            console.error("Update user failed: ", err)
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
            banner: data.banner,
            bannerPositionY: data.bannerPositionY
        }))

        return data.banner
    }

    async function updateBannerPosition(positionY) {
        const res = await apiFetch("/api/users/banner-position", {
            method: "PATCH",
            body: JSON.stringify({ positionY })
        })

        if (!res.ok) {
            throw new Error("Failed to update banner position")
        }

        const data = await res.json()

        setUser(prev => ({
            ...prev,
            bannerPositionY: data.bannerPositionY
        }))

        return data.bannerPositionY
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
            console.error("Change password failed: ", err)
            throw err
        }
    } 

    async function requestEmailChange(newEmail, password) {
        try {
            const res = await apiFetch("/api/users/email-change", {
                method: "POST",
                body: JSON.stringify({ newEmail, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Request email change failed")
            }

            return data
        } catch (err) {
            console.error("Request email change failed: ", err)
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
            console.error("Delete account failed: ", err)
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
            console.error("Reset app failed: ", err)
            throw err
        }
    }

    function logout() {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, updateUser, fetchUser, loading, uploadAvatar, removeAvatar, uploadBanner, removeBanner, updateBannerPosition, changePassword, requestEmailChange, deleteAccount, resetApp, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}