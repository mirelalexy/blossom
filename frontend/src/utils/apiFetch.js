const API_URL = import.meta.env.VITE_API_URL

let onUnauthorized = null

export function setUnauthorizedHandler(fn) {
    onUnauthorized = fn
}

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token")

    const isFormData = options.body instanceof FormData

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            // JSON only when body is a string
            ...(options.body && !isFormData
                ? { "Content-Type": "application/json" }
                : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // caller can override headers last
            ...options.headers
        }
    })

    if (res.status === 401) {
        localStorage.removeItem("token")
        if (onUnauthorized) onUnauthorized()
            
        throw new Error("Your session timed out. Let's get you back in.")
    }

    return res
}