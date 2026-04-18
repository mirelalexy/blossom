import { createContext, useContext, useState } from "react"

import XPToast from "../components/ui/XPToast"

const XPToastContext = createContext()

export function XPToastProvider({ children }) {
    const [toast, setToast] = useState(null)

    function showXPToast(xpData) {
        setToast(xpData)

        setTimeout(() => {
            setToast(null)
        }, 2000)
    }

    return (
        <XPToastContext.Provider value={{ showXPToast }}>
            {children}
            {toast && <XPToast xp={toast} />}
        </XPToastContext.Provider>
    )
}

export function useXPToast() {
    return useContext(XPToastContext)
}