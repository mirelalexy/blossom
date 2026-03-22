import { useEffect } from "react"

import { useChallenges } from "../store/ChallengeStore"
import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { calculateStreak } from "../utils/streakUtils"
import { useNotifications } from "../store/NotificationStore"
import { calculateXP, getLevelFromXP, getLevelTitle } from "../utils/levelUtils"

import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout({ children }) {
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

        const notified = new Set(JSON.parse(localStorage.getItem("notifiedChallenges")) || [])

        const newNotified = new Set(notified)

        challenges.forEach(c => {
            if (c.completed && !notified.has(c.id)) {
                addNotification({
                    title: "Challenge completed",
                    message: `${c.title} completed! Keep going.`,
                    type: "challenge"
                })

                newNotified.add(c.id)
            }
        })

        localStorage.setItem("notifiedChallenges", JSON.stringify([...newNotified]))
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

        const triggered = JSON.parse(localStorage.getItem("nearBudgetNotified")) || false

        if (percentUsedBudget >= 80 && !triggered) {
            addNotification({
                title: "Almost there...",
                message: "You're close to your monthly budget.",
                type: "budget"
            })

            localStorage.setItem("nearBudgetNotified", true)
        }
    }, [percentUsedBudget, settings.nearBudget])

    // trigger exceeded budget notifications
    useEffect(() => {
        if (!settings.exceedBudget) return
        if (!budget?.monthlyBudget) return

        const triggered = JSON.parse(localStorage.getItem("exceedBudgetNotified")) || false

        if (percentUsedBudget >= 100 && !triggered) {
            addNotification({
                title: "Budget exceeded",
                message: "You've gone over your monthly budget.",
                type: "budget"
            })

            localStorage.setItem("exceedBudgetNotified", true)
        }
    }, [percentUsedBudget, settings.exceedBudget])

    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout