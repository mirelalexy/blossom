import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { apiFetch } from "../../utils/apiFetch"
import { isEvilMode } from "../../utils/evilBlossom"

import useOpenChat from "../../hooks/useOpenChat"

import ChatModal from "./ChatModal"

import "../../styles/components/FloatingChatButton.css"

function FloatingChatButton() {
    const location = useLocation()
    const isEvil = isEvilMode()

    const { openChat, isModalOpen, modalInsight, closeModal } = useOpenChat()
    const [pendingInsight, setPendingInsight] = useState(null)

    // hidden in Settings pages or when the Chat page is already open
    const isHidden = location.pathname.startsWith("/settings") || location.pathname === "/chat"

    useEffect(() => {
        // ignore stale responses if the user navigates before the request finishes
        let cancelled = false

        async function fetchPending() {
            try {
                const res = await apiFetch("/api/insights/pending")
                const data = await res.json()
                if (!cancelled) setPendingInsight(data)
            } catch (err) {
                console.error("Failed to fetch pending insight: ", err)
            }
        }

        fetchPending()

        return () => { cancelled = true }
    }, [location.pathname])

    async function handleClick() {
        if (pendingInsight) {
            openChat(pendingInsight.message)

            // mark as seen
            setPendingInsight(null)

            try {
                await apiFetch(`/api/insights/${pendingInsight.id}/seen`, {
                    method: "POST"
                })
            } catch (err) {
                console.error("Failed to mark insight as seen: ", err)
            }
        } else {
            openChat()
        }
    }

    if (isHidden) return null

    return (
        <>
            <button
                className={`floating-chat-btn ${pendingInsight ? "floating-chat-btn--has-update" : ""}`}
                onClick={handleClick}
                aria-label="Ask Blossom"
            >
                <span className="floating-chat-btn-flower">🌸</span>
                {pendingInsight && <span className="floating-chat-btn-dot" />}
            </button>

            {isModalOpen && (
                <ChatModal onClose={closeModal} initialInsight={modalInsight} />
            )}
        </>
    )
}

export default FloatingChatButton