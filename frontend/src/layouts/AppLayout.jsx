import { useEffect, useRef } from "react"

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
    
    const prevCompletedRef = useRef(new Set())

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

        const currentCompleted = new Set(challenges.filter(c => c.completed).map(c=> c.id))

        currentCompleted.forEach(id => {
            if (!prevCompletedRef.current.has(id)) {
                const c = challenges.find(c => c.id === id)

                addNotification({
                    title: "Challenge completed",
                    message: `${c.title} completed! Keep going.`,
                    type: "challenge"
                })
            }
        })

        prevCompletedRef.current = currentCompleted
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