import { useEffect } from "react"

import { useChallenges } from "../store/ChallengeStore"
import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { calculateStreak } from "../utils/streakUtils"
import { useNotifications } from "../store/NotificationStore"

import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout({ children }) {
    const { challenges, evaluateChallenges, resetChallenges } = useChallenges()
    const { transactions } = useTransactions()
    const { budget } = useBudget()
    const { cleanOldNotifications, addNotification, settings } = useNotifications()

    const streak = calculateStreak(transactions)

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
    }, [challenges])

    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout