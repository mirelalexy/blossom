import { useEffect } from "react"
import "../../styles/components/Modal.css"

function Modal({ title, children, onClose, actions, variant = "default" }) {
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prev
        }
    }, [])

    return (
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div className={`modal ${variant}`} role="dialog" aria-modal="true">
                {title && <h2 className="modal-title">{title}</h2>}
            </div>
            <div className="modal-body">
                {children}
            </div>
            {actions && <div className="modal-actions">{actions}</div>}
        </>
    )
}

export default Modal