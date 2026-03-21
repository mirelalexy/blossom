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
    const { evaluateChallenges, resetChallenges } = useChallenges()
    const { transactions } = useTransactions()
    const { budget } = useBudget()
    const { cleanOldNotifications } = useNotifications()

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

    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout