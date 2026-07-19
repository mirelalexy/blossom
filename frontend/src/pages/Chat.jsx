import { useNavigate } from "react-router-dom"

import ChatWindow from "../components/chat/ChatWindow"

function Chat() {
    const navigate = useNavigate()

    return <ChatWindow variant="page" onClose={() => navigate(-1)} />
}

export default Chat