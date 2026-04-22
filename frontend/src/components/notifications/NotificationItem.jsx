import { formatTime } from "../../utils/dateUtils"

import Icon from "../ui/Icon"

import "../../styles/components/NotificationItem.css"

const TYPE_ICONS = {
    budget: "budget",
    challenge: "profile",
    level: "categories",
    goal: "goals",
    reminder: "notifications",
    default: "notifications"
}

function NotificationItem({ notification }) {
    const iconName = TYPE_ICONS[notification.type] || TYPE_ICONS.default
    const isUnread = !notification.read

    return (
        <div className={`notification-item ${isUnread ? "notification-item--unread" : ""}`}>
            <div className={`notification-icon-wrap notification-icon-wrap--${notification.type || "default"}`}>
                <Icon name={iconName} size={18} />
            </div>
            
            <div className="notification-body">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">{formatTime(notification.created_at)}</p>
            </div>

            {isUnread && <div className="notification-unread-dot" />}
        </div>
    )
}

export default NotificationItem