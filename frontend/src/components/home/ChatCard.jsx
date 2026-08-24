import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "../ui/Card"
import ChatModal from "../chat/ChatModal"
import Icon from "../ui/Icon"

import useOpenChat from "../../hooks/useOpenChat"
import { isEvilMode } from "../../utils/evilBlossom"

import "../../styles/components/ChatCard.css"

const REGULAR_PROMPTS = [
    "Why did I spend more this week?",
    "What do I buy when I'm sad?",
    "How am I doing lately?",
    "What's been on my mind?",
    "Where does most of my money go?",
    "What habits have changed recently?",
    "Am I getting better with impulse spending?",
    "What's my biggest spending pattern?",
    "When do I spend the most?",
    "What should I pay attention to?",
    "What does my Journey say about me?"
]

const EVIL_PROMPTS = [
    "What's my data trying to tell me?",
    "What keeps costing me money?",
    "What do my moods reveal?",
    "Which category owns me?",
    "Surprise me with something about myself.",
    "Tell me the uncomfortable truth.",
    "Which habit is holding me back?"
]

const ROTATE_INTERVAL = 5000

function ChatCard() {
    const isEvil = isEvilMode()
    const prompts = isEvil ? EVIL_PROMPTS : REGULAR_PROMPTS

    const [index, setIndex] = useState(0)
    const { openChat, isModalOpen, closeModal } = useOpenChat()

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % prompts.length)
        }, ROTATE_INTERVAL)

        return () => clearInterval(timer)
    }, [prompts.length])

    return (
        <>
            <Card
                title="Ask Me"
                icon={<Icon name="chat" size={20} />}
                className="home-chat-card"
                onClick={() => openChat()}
            >
                <div className="home-chat-card-inner">
                    <div className="home-chat-flower">🌸</div>

                    <p key={index} className="home-chat-text fade-in-text">
                        {prompts[index]}
                    </p>
                </div>
            </Card>

            {isModalOpen && (
                <ChatModal onClose={closeModal} />
            )}
        </>
    )
}

export default ChatCard
