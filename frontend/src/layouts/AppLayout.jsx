import { useEffect } from "react"
import { Navigate } from "react-router-dom"

import { useChallenges } from "../store/ChallengeStore"
import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { useNotifications } from "../store/NotificationStore"
import { useNotificationSettings } from "../store/NotificationSettingsStore"

import { calculateStreak } from "../utils/streakUtils"
import { calculateXP, getLevelFromXP, getLevelTitle } from "../utils/levelUtils"
import { getCurrentMonthKey, getCurrentWeekKey, getReminderKey } from "../utils/dateUtils"

import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout({ children }) {    
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" />
    }

    const { challenges, evaluateChallenges, resetChallenges } = useChallenges()
    const { transactions } = useTransactions()
    const { budget } = useBudget()
    const { addNotification } = useNotifications()
    const { notificationSettings: settings } = useNotificationSettings()

    const streak = calculateStreak(transactions)
    const completedChallenges = challenges.filter(c => c.completed).length

    const xp = calculateXP({
        transactions,
        streak,
        goalsCompleted: 0,
        weeklyLimitsHit: 0,
        completedChallenges
    })

    const level = getLevelFromXP(xp)

    const expenseTransactions = transactions.filter(t => t.type === "expense")

    const expenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

    const percentUsedBudget = budget?.monthly_limit ? (expenses / budget.monthly_limit) * 100 : 0

    // reset challenges if needed
    useEffect(() => {
        resetChallenges()
    }, [transactions])

    useEffect(() => {
        evaluateChallenges({
            transactions,
            streak,
            budget
        })
    }, [transactions, streak, budget])

    // trigger challenge notifications
    useEffect(() => {
        if (!settings.challenge_complete) return

        const notified = JSON.parse(localStorage.getItem("notifiedChallenges")) || {}

        const weekKey = getCurrentWeekKey()
        const monthKey = getCurrentMonthKey()

        challenges.forEach(c => {
            const periodKey = c.period === "weekly" ? weekKey : monthKey

            if (c.completed && notified[c.id] !== periodKey) {
                addNotification({
                    title: "Challenge completed",
                    message: `${c.title} completed! Keep going.`,
                    type: "challenge"
                })

                notified[c.id] = periodKey
            }
        })

        localStorage.setItem("notifiedChallenges", JSON.stringify(notified))
    }, [challenges, settings.challenge_complete])

    // trigger level up notifications
    useEffect(() => {
        if (!settings.level_up) return
        
        const prevLevel = Number(localStorage.getItem("prevLevel")) || 1

        if (level > prevLevel) {
            const title = getLevelTitle(level)
            console.log(title)

            addNotification({
                title: "Level up!",
                message: `You reached level ${level}, ${title}`,
                type: "level"
            })
        }

        localStorage.setItem("prevLevel", level)
    }, [level, settings.level_up])

    // trigger near budget notifications
    useEffect(() => {
        if (!settings.near_budget) return
        if (!budget?.monthly_limit) return

        const currentMonth = getCurrentMonthKey()
        const lastNotified = localStorage.getItem("nearBudgetNotifiedMonth")

        if (percentUsedBudget >= 80 && lastNotified !== currentMonth) {
            addNotification({
                title: "Almost there...",
                message: "You're close to your monthly budget.",
                type: "budget"
            })

            localStorage.setItem("nearBudgetNotifiedMonth", currentMonth)
        }
    }, [percentUsedBudget, settings.near_budget])

    // trigger exceeded budget notifications
    useEffect(() => {
        if (!settings.exceed_budget) return
        if (!budget?.monthly_limit) return

        const currentMonth = getCurrentMonthKey()
        const lastNotified = localStorage.getItem("exceedBudgetNotifiedMonth")

        if (percentUsedBudget > 100 && lastNotified !== currentMonth) {
            addNotification({
                title: "Budget exceeded",
                message: "You've gone over your monthly budget.",
                type: "budget"
            })

            localStorage.setItem("exceedBudgetNotifiedMonth", currentMonth)
        }
    }, [percentUsedBudget, settings.exceed_budget])

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