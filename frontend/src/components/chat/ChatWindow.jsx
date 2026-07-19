import { useEffect, useRef, useState } from "react"

import { useUser } from "../../store/UserStore"

import { isEvilMode } from "../../utils/evilBlossom"
import { formatDate } from "../../utils/dateUtils"

import Icon from "../ui/Icon"

import "../../styles/components/ChatWindow.css"

const OPENING_MESSAGE = {
    regular: "Hey, what's on your mind?",
    evil: "Want to share something?"
}

// test out feature using replies based on keywords
const REPLIES = [
    {
        keywords: ["coffee"],
        regular: "You've logged coffee 9 times this month, 6 tagged impulse, and 5 of those before 9am. Does that timing match what you'd expect?",
        evil: "Nine times. Six impulse, by your own tag. Mostly before 9am. You already know this one."
    },
    {
        keywords: ["anxious", "anxiety", "stress"],
        regular: "Anxious-tagged purchases make up about 18% of your entries but 35% of your spending... so when you're anxious, you spend more per purchase, not just more often. Does that fit?",
        evil: "Anxious tags: 18% of entries, 35% of the money. You spend bigger, not just more. Draw your own conclusion."
    },
    {
        keywords: ["guilt", "guilty"],
        regular: "Guilt shows up in your notes on self purchases far more than on ones for other people. Is the guilt about the money, or about giving yourself permission?",
        evil: "Guilt shows up a lot more when the purchase is for you, not someone else. That's not a money pattern. You know what it is."
    },
    {
        keywords: ["doing", "how am i", "this month"],
        regular: "You're on a solid streak, and your impulse-tagged spending has dropped since last month. That's a real shift, not a lucky stretch.",
        evil: "Streak's holding. Impulse spending's down from last month. Fine. That's good, actually."
    }
]

const FALLBACK_REPLY = {
    regular: "I can only really speak to what's in your Journey, like transactions, moods, and goals. Want to ask me about one of those?",
    evil: "That's not really my place. Stick to your data and I'll have something to say."
}

function getReply(question, isEvil) {
    const lower = question.toLowerCase()
    const match = REPLIES.find((r) => r.keywords.some((k) => lower.includes(k)))
    const entry = match || FALLBACK_REPLY

    return isEvil ? entry.evil : entry.regular
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
    const now = useRef(new Date()).current

    const { user } = useUser()
    const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "?"

    const [messages, setMessages] = useState([
        {
            id: "opening",
            role: "blossom",
            text: isEvil ? OPENING_MESSAGE.evil : OPENING_MESSAGE.regular,
            time: now
        }
    ])

    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)

    // auto scroll on new message
    const listRef = useRef(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, isThinking])

    function handleSend() {
        const question = input.trim()
        if (!question) return

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

        // TODO: replace with real API call
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: "blossom",
                    text: getReply(question, isEvil),
                    time: new Date()
                }
            ])

            setIsThinking(false)
        }, 1100)
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
                                    {m.text}
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