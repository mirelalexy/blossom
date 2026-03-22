import { useNotifications } from "../store/NotificationStore"

import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"

import "../styles/pages/Notifications.css"

function Notifications() {
    const { notifications } = useNotifications()

    return (
        <div className="notifications-content">
            <PageHeader title="Notifications"></PageHeader>
            
            {notifications.length > 0 ? (
                <div className="notifications-list">
                    {notifications.map(n => (
                        <NotificationItem key={n.id} notification={n} />
                    ))}
                </div>
            ) : (
                <EmptyState title="No notifications yet" />
            )}
            
        </div>
    )
}

export default Notifications