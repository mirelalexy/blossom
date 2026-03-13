import { createContext, useContext, useState, useEffect } from "react"

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(localStorage.getItem("currency") || "EUR")

    function updateCurrency(newCurrency) {
        setCurrency(newCurrency)
        localStorage.setItem("currency", newCurrency)
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