import { useEffect } from "react"
import { Navigate } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { useNotifications } from "../store/NotificationStore"
import { useNotificationSettings } from "../store/NotificationSettingsStore"

import { getReminderKey } from "../utils/dateUtils"

import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout({ children }) {    
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" />
    }

    const { transactions } = useTransactions()
    const { addNotification } = useNotifications()
    const { notificationSettings: settings } = useNotificationSettings()

    // trigger log reminders (daily, evening)
    useEffect(() => {
        if (!settings.log_reminder) return

        const now = new Date()
        const hour = now.getHours()

        if (hour < 18 || hour > 22) return

        const today = now.toDateString()
        const lastNotified = localStorage.getItem("logReminderDate")

        const hasLoggedToday = transactions.some(t => {
            return new Date(t.date).toDateString() === today
        })

        if (!hasLoggedToday && lastNotified !== today) {
            addNotification({
                title: "Don't forget!",
                message: "Log your transactions for today.",
                type: "reminder"
            })

            localStorage.setItem("logReminderDate", today)
        }
    }, [transactions, settings.log_reminder])

    // trigger recurring reminders (weekly/monthly)
    useEffect(() => {
        if (!settings.recurring_reminder) return

        const recurring = transactions.filter(t => t.recurring)
        if (recurring.length === 0) return

        const key = getReminderKey(settings.recurring_frequency)
        const lastNotified = localStorage.getItem("recurringReminderKey")

        if (lastNotified !== key) {
            addNotification({
                title: "Quick check",
                message: `You have ${recurring.length} recurring payments to review.`,
                type: "reminder"
            })

            localStorage.setItem("recurringReminderKey", key)
        }
    }, [transactions, settings.recurring_reminder, settings.recurring_frequency])

    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout