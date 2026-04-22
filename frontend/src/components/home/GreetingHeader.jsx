import { Link, useNavigate } from "react-router-dom"

import { useUser } from "../../store/UserStore"

import Icon from "../ui/Icon"

function GreetingHeader({ greeting, message, avatarSrc }) {
    const navigate = useNavigate()
    const { user } = useUser()

    const initial  = user.displayName ? user.displayName.charAt(0).toUpperCase() : "?"

    return (
        <div className="greeting-header">
            <div className="greeting-left">
                <div className="home-avatar-wrapper" onClick={() => navigate("/profile")}>
                    { avatarSrc ? (
                        <img src={avatarSrc} className="home-avatar"/>
                    ) : (
                        <div className="avatar-placeholder">
                            <span className="avatar-initial">{initial}</span>
                        </div>
                    )}
                </div>
                
                <div className="greeting-user-info">
                    <h2>{greeting}</h2>
                    <p>{message}</p>
                </div>
            </div>

            <Link to="/notifications" className="notifications-btn">
                <Icon name="notifications" size={22} />
            </Link>
        </div>
    )
}

export default GreetingHeader