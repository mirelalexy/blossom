import { useNotifications } from "../store/NotificationStore"
import { groupNotifications } from "../utils/notificationUtils"

import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"

import "../styles/pages/Notifications.css"

function Notifications() {
    const { notifications } = useNotifications()
    const { today, yesterday, older } = groupNotifications(notifications)

    return (
        <div className="notifications-content">
            <PageHeader title="Notifications"></PageHeader>
            
            {notifications.length > 0 ? (
                <>
                    {today.length > 0 && (
                        <Section title="Today">
                            {today.map(n => (
                                <NotificationItem key={n.id} notification={n} />
                            ))}
                        </Section>
                    )}

                    {yesterday.length > 0 && (
                        <Section title="Yesterday">
                            {yesterday.map(n => (
                                <NotificationItem key={n.id} notification={n} />
                            ))}
                        </Section>
                    )}

                    {older.length > 0 && (
                        <Section title="Older">
                            {older.map(n => (
                                <NotificationItem key={n.id} notification={n} />
                            ))}
                        </Section>
                    )}
                </>
            ) : (
                <EmptyState title="No notifications yet" />
            )}
            
        </div>
    )
}

export default Notifications