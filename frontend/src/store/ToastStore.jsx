import { createContext, useContext, useState, useCallback } from "react"

import Toast from "../components/ui/Toast"
import XPToast from "../components/ui/XPToast"

const ToastContext = createContext()

const DURATION = 3600 // regular toasts
const XP_DURATION = 2600 // XP toasts
const MAX_VISIBLE = 4

let _id = 0
const uid = () => ++_id

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    function dismiss(id) {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    function enqueue(item, duration) {
        const id = uid()
        
        setToasts(prev => {
            const trimmed = prev.length >= MAX_VISIBLE ? prev.slice(-(MAX_VISIBLE - 1)) : prev
            return [...trimmed, { id, ...item }]
        })
        
        setTimeout(() => dismiss(id), duration)
    }
    
    const showToast = useCallback(({ message, type = "success" }) => {
        enqueue({ kind: "toast", message, type }, DURATION)
    }, [])
    
    const showXPToast = useCallback((xpData) => {
        if (!xpData?.gained) return
        enqueue({ kind: "xp", ...xpData }, XP_DURATION)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, showXPToast }}>
            {children}
            {toasts.length > 0 && (
                <div className="toast-stack" aria-live="polite">
                    {toasts.map(t =>
                        t.kind === "xp"
                            ? <XPToast key={t.id} gained={t.gained} leveledUp={t.leveledUp} />
                            : <Toast key={t.id} message={t.message} type={t.type} />
                    )}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}