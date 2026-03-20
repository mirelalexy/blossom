import { useEffect } from "react"

import { useChallenges } from "../store/ChallengeStore"
import { useTransactions } from "../store/TransactionStore"
import { useBudget } from "../store/BudgetStore"
import { calculateStreak } from "../utils/streakUtils"

import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"

import "./AppLayout.css"

function AppLayout({ children }) {
    const { evaluateChallenges } = useChallenges()
    const { transactions } = useTransactions()
    const { budget } = useBudget()

    const streak = calculateStreak(transactions)

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