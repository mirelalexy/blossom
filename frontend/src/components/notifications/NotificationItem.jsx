import { formatTime } from "../../utils/dateUtils"

import Icon from "../ui/Icon"

import "../../styles/components/NotificationItem.css"

function NotificationItem({ notification }) {
    return (
        <div className="notification-item">
            <div className="notification-left">
                <Icon className="notification-icon" name="categories" size={30} />
            </div>
            
            <div className="notification-right">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">{formatTime(notification.created_at)}</p>
            </div>
        </div>
    )
}

export default NotificationItem