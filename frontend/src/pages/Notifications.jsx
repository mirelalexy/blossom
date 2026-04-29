import { useState, useEffect } from "react"

import { useNotifications } from "../store/NotificationStore"

import { groupNotifications } from "../utils/notificationUtils"
import { getEmpty } from "../data/emptyStates"

import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import "../styles/pages/Notifications.css"

const PAGE_SIZE = 15

function Notifications() {
    const { notifications, markAsRead } = useNotifications()
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    // mark all unread notifications as read when the page opens
    useEffect(() => {
        const unread = notifications.filter(n => !n.read)
        if (unread.length === 0) return

        // add small delay so user sees the unread state briefly
        const timer = setTimeout(() => {
            unread.forEach(n => markAsRead(n.id))
        }, 800)

        return () => clearTimeout(timer)
    }, []) // only fire on mount, not on every update

    // paginate before grouping
    const visible = notifications.slice(0, visibleCount)
    const hasMore = notifications.length > visibleCount

    const { today, yesterday, older } = groupNotifications(visible)

    return (
        <div className="page">
            <PageHeader title="Notifications" />
            
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

                    {hasMore && (
                        <Button
                            className="secondary"
                            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        >
                            Show more ({notifications.length - visibleCount} remaining)
                        </Button>
                    )}
                </>
            ) : (
                <EmptyState {...getEmpty("notifications")} />
            )}
            
        </div>
    )
}

export default Notifications