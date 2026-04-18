import { createContext, useContext, useState } from "react"

import Toast from "../components/ui/Toast"

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    function showToast({ message, type = "success" }) {
        const id = Date.now()

        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 2000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} {...t} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}