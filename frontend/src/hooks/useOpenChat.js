import { useState } from "react"
import { useNavigate } from "react-router-dom"

import useIsMobile from "./useIsMobile"

function useOpenChat() {
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalInsight, setModalInsight] = useState(null)

    function openChat(insightMessage = null) {
        if (isMobile) {
            navigate("/chat", {
                state: { insightMessage }
            })
        } else {
            setModalInsight(insightMessage)
            setIsModalOpen(true)
        }
    }

    function closeModal() {
        setIsModalOpen(false)
        setModalInsight(null)
    }

    return { openChat, isModalOpen, modalInsight, closeModal }
}

export default useOpenChat