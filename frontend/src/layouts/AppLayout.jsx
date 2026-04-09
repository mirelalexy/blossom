import { useEffect } from "react"
import { Navigate } from "react-router-dom"

import { useChallenges } from "../store/ChallengeStore"
import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { useNotifications } from "../store/NotificationStore"

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
    const { cleanOldNotifications, addNotification, settings } = useNotifications()

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

    const expenseTransactions = transactions.filter(t => t.type === "Expense")

    const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

    const percentUsedBudget = budget?.monthlyBudget ? (expenses / budget.monthlyBudget) * 100 : 0

    // reset challenges if needed and clean notifications older than two weeks
    useEffect(() => {
        resetChallenges()
        cleanOldNotifications()
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
        if (!settings.challengeComplete) return

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
    }, [challenges, settings.challengeComplete])

    // trigger level up notifications
    useEffect(() => {
        if (!settings.levelUp) return
        
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
    }, [level, settings.levelUp])

    // trigger near budget notifications
    useEffect(() => {
        if (!settings.nearBudget) return
        if (!budget?.monthlyBudget) return

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
    }, [percentUsedBudget, settings.nearBudget])

    // trigger exceeded budget notifications
    useEffect(() => {
        if (!settings.exceedBudget) return
        if (!budget?.monthlyBudget) return

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
    }, [percentUsedBudget, settings.exceedBudget])

    // trigger log reminders (daily, evening)
    useEffect(() => {
        if (!settings.logReminder) return

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
    }, [transactions, settings.logReminder])

    // trigger recurring reminders (weekly/monthly)
    useEffect(() => {
        if (!settings.recurringReminder) return

        const recurring = transactions.filter(t => t.recurring)
        if (recurring.length === 0) return

        const key = getReminderKey(settings.frequency)
        const lastNotified = localStorage.getItem("recurringReminderKey")

        if (lastNotified !== key) {
            addNotification({
                title: "Quick check",
                message: `You have ${recurring.length} recurring payments to review.`,
                type: "reminder"
            })

            localStorage.setItem("recurringReminderKey", key)
        }
    }, [transactions, settings.recurringReminder, settings.frequency])

    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout