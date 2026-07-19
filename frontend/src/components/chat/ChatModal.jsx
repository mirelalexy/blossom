import { useEffect } from "react"

import ChatWindow from "./ChatWindow"

import "../../styles/components/ChatModal.css"

function ChatModal({ onClose }) {
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = prev
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    return (
        <>
            <div className="chat-modal-overlay" onClick={onClose} />
            <div className="chat-modal-panel" role="dialog" aria-modal="true">
                <ChatWindow variant="modal" onClose={onClose} />
            </div>
        </>
    )
}

export default ChatModal
