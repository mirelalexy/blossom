import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

import { useUser } from "../../store/UserStore"

import { isEvilMode } from "../../utils/evilBlossom"
import { formatDate } from "../../utils/dateUtils"
import { apiFetch } from "../../utils/apiFetch"

import Icon from "../ui/Icon"

import "../../styles/components/ChatWindow.css"

const OPENING_MESSAGE = {
    regular: "Hey, what's on your mind?",
    evil: "Want to share something?"
}

const ERROR_REPLY = {
    regular: "Something went wrong on my end. Mind trying that again?",
    evil: "That didn't work. Try again."
}

// generate random ID until fetch from API is available
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// time dividers spawn every five minutes
const DIVIDER_GAP = 5 * 60 * 1000
 
function shouldShowDivider(current, previous) {
    if (!previous) return true
    return current.time - previous.time > DIVIDER_GAP
}
 
function formatDividerTime(date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

function ChatWindow({ variant = "page", onClose }) {
    const isEvil = isEvilMode()

    const { user } = useUser()
    const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "?"

    const [messages, setMessages] = useState([
        {
            id: "opening",
            role: "blossom",
            text: isEvil ? OPENING_MESSAGE.evil : OPENING_MESSAGE.regular,
            time: new Date()
        }
    ])

    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)

    // auto scroll on new message
    const listRef = useRef(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, isThinking])

    async function handleSend() {
        const question = input.trim()
        if (!question) return

        // snapshot history before adding new question
        const conversationHistory = messages
            .filter((m) => m.id !== "opening")
            .map((m) => ({ role: m.role, text: m.text }))

        setMessages((prev) => [
            ...prev,
            {
                id: generateId(),
                role: "user",
                text: question,
                time: new Date()
            }
        ])

        setInput("")
        setIsThinking(true)

        try {
            const res = await apiFetch("/api/chat/ask", {
                method: "POST",
                body: JSON.stringify({
                    question,
                    isEvil,
                    conversationHistory
                })
            })

            if (!res.ok) throw new Error("Request failed")

            const data = await res.json()

            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: "blossom",
                    text: data.response,
                    time: new Date()
                }
            ])
        } catch (err) {
            console.error("Ask Blossom failed: ", err)
            
            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: "blossom",
                    text: isEvil ? ERROR_REPLY.evil : ERROR_REPLY.regular,
                    time: new Date()
                }
            ])
        } finally {
            setIsThinking(false)
        }
    }

    // send using enter
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className={`chat-window chat-window-${variant}`}>
            <div className="chat-header">
                <button className="chat-icon-btn" onClick={onClose} aria-label="Back">
                    <Icon name={variant === "modal" ? "close" : "back"} size={20} />
                </button>
 
                <p className="chat-header-name">Blossom</p>
            </div>
 
            <div className="chat-messages" ref={listRef}>
                {messages.map((m, i) => {
                    const previous = messages[i - 1]
                    const showDivider = shouldShowDivider(m, previous)
 
                    return (
                        <div key={m.id} className="chat-message-group">
                            {showDivider && (
                                <div className="chat-time-divider">{formatDividerTime(m.time)}</div>
                            )}
 
                            <div className={`chat-message-row chat-message-row-${m.role}`}>
                                <div className={`chat-avatar-wrapper-${m.role}`}>
                                    {m.role === "blossom" ? (
                                        "🌸"
                                    ) : user?.avatar ? (
                                        <img className="chat-avatar" src={user.avatar} alt="Profile picture" />
                                    ) : (
                                        <span>{userInitial}</span>
                                    )}
                                </div>
 
                                <div className={`chat-bubble chat-bubble-${m.role}`}>
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )
                })}
 
                {isThinking && (
                    <div className="chat-message-row chat-message-row-blossom">
                        <div className="chat-avatar-wrapper-blossom">🌸</div>
                        <div className="chat-bubble chat-bubble-blossom chat-thinking">
                            <span className="chat-thinking-dot" />
                            <span className="chat-thinking-dot" />
                            <span className="chat-thinking-dot" />
                        </div>
                    </div>
                )}
            </div>
 
            <div className="chat-input-bar">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                />
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    aria-label="Send message"
                >
                    <Icon name="up" size={20} color="var(--bg-primary)" />
                </button>
            </div>
        </div>
    )
}

export default ChatWindow