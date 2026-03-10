import { Link } from "react-router-dom"
import Icon from "../ui/Icon"

function GreetingHeader({ greeting, username, message }) {
    return (
        <div className="greeting-header">
            <div className="greeting-left">
                <div className="home-avatar-wrapper">
                    <img src="/avatar.gif" className="home-avatar"/>
                </div>
                
                <div className="greeting-user-info">
                    <h2>{greeting}, <span>{username}</span>!</h2>
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