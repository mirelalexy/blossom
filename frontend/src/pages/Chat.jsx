import { useNavigate, useLocation } from "react-router-dom"

import ChatWindow from "../components/chat/ChatWindow"

function Chat() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <ChatWindow 
            variant="page" 
            onClose={() => navigate(-1)} 
            initialInsight={location.state?.insightMessage}
        />
    )
}

export default Chat