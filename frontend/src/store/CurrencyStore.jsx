import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
    const { user } = useUser()
    const [currency, setCurrency] = useState("EUR")

    useEffect(() => {
        if (!user) return

        async function fetchCurrency() {
            const token = localStorage.getItem("token")
        
            if (!token) return

            const res = await apiFetch("/api/users/me")
        
            const data = await res.json()
        
            setCurrency(data.currency || "EUR")
        }
        
        fetchCurrency()
    }, [user])

    async function updateCurrency(newCurrency) {
        const token = localStorage.getItem("token")

        // instant UI update then save in DB
        setCurrency(newCurrency)

        await apiFetch("/api/users/settings", {
            method: "PUT",
            body: JSON.stringify({ currency: newCurrency })
        })
    }

    return (
        <CurrencyContext.Provider value={{ currency, updateCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    return useContext(CurrencyContext)
}