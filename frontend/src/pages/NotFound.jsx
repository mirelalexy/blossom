import { useNavigate } from "react-router-dom"

import Button from "../components/ui/Button"

import "../styles/pages/NotFound.css"

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <p className="not-found-emoji">🌸</p>
                <h1 className="not-found-title">Lost?</h1>
                <p className="secondary-text not-found-sub">
                    The URL might be wrong or this page was removed.
                </p>
                <Button onClick={() => navigate("/")}>
                    Take Me Home
                </Button>
            </div>
        </div>
    )
}

export default NotFound