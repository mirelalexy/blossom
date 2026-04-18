import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useUser } from "../store/UserStore"
import { useBudget } from "../store/BudgetStore"
import { useNotifications } from "../store/NotificationStore"
import { useNotificationSettings } from "../store/NotificationSettingsStore"

import { getReminderKey, getStartOfDay, parseLocalDate } from "../utils/dateUtils"

import BlossomLoader from "../components/ui/BlossomLoader"
import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout() {    
    const { user, loading } = useUser()

    if (!user && !loading) {
        return <Navigate to="/login" />
    }

    if (loading) {
        return <BlossomLoader />
    }

    return <AppLayoutInner />
}

function AppLayoutInner() {
    const { transactions } = useTransactions()
    const { addNotification } = useNotifications()
    const { notificationSettings: settings } = useNotificationSettings()

    // trigger log reminders (daily, evening)
    useEffect(() => {
        if (!settings?.log_reminder) return

        const now = new Date()
        const hour = now.getHours()

        if (hour < 18 || hour > 22) return

        const today = getStartOfDay(new Date())

        const hasLoggedToday = transactions.some(t => {
            const transactionDate = getStartOfDay(parseLocalDate(t.date))
            return transactionDate.getTime() === today.getTime()
        })

        if (!hasLoggedToday) {
            const eventKey = `log_reminder_${today.toISOString().slice(0, 10)}`

            addNotification({
                title: "Don't forget!",
                message: "Log your transactions for today.",
                type: "reminder"
            }, eventKey)
        }
    }, [transactions, settings?.log_reminder])

    // trigger recurring reminders (weekly/monthly)
    useEffect(() => {
        if (!settings?.recurring_reminder) return

        const recurring = transactions.filter(t => t.is_recurring)
        if (recurring.length === 0) return

        const key = getReminderKey(settings.recurring_frequency)

        const eventKey = `recurring_reminder_${key}`
        
        addNotification({
            title: "Quick check",
            message: `You have ${recurring.length} recurring payments to review.`,
            type: "reminder"
        }, eventKey)
    }, [transactions, settings?.recurring_reminder, settings?.recurring_frequency])

    return (
        <div className="layout">
            <Sidebar />
            <main>
                <Outlet />
            </main>
            <Bottombar />
        </div>
    )
}

export default AppLayout