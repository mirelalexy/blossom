import { useNavigate } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useGoals } from "../store/GoalsStore"
import { getNextMonthInfo, getGreeting } from "../utils/dateUtils"
import { useCategories } from "../store/CategoryStore"
import { useUser } from "../store/UserStore"
import { calculateStreak, getNextMilestone, getStreakMessage } from "../utils/streakUtils"

import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import StreakCard from "../components/home/StreakCard"

import "../styles/pages/Home.css"

function Home() {
    const navigate = useNavigate()

    const today = new Date()

    const { transactions } = useTransactions()
    const { getCategoryById } = useCategories()
    const { user } = useUser()

    const { goals } = useGoals()
    const primaryGoal = goals.find(g => g.primaryGoal)

    let streak = calculateStreak(transactions)
    const streakMessage = getStreakMessage(streak)
    const nextStreakMileStone = getNextMilestone(streak)

    const recentTransactions = transactions
        .filter((t) => {
            if (!t.date) return false

            const transactionDate = new Date(t.date)
            const diffDays = (today - transactionDate) / (1000 * 60 * 60 * 24)

            return diffDays >= 0 && diffDays <= 7
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)

    function calculateTopCategory(transactions) {
        const now = new Date()
        const monthlyExpenses = transactions.filter(t => {
            const date = new Date(t.date)

            return (
                t.type === "Expense" && t.categoryId && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            )
        })

        const categoryTotals = {}

        monthlyExpenses.forEach(t => {
            categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount
        })

        let topCategoryId = null
        let highestAmount = 0

        Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
            if (amount > highestAmount) {
                highestAmount = amount
                topCategoryId = categoryId
            }
        })

        return topCategoryId
    }

    const topCategoryId = calculateTopCategory(transactions)
    const topCategory = getCategoryById(topCategoryId)

    const message = getNextMonthInfo()
    const greeting = getGreeting()

    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader greeting={greeting} username={user.displayName} message={message} avatarSrc={user.avatar}/>

                <StreakCard streak={streak} message={streakMessage} nextMileStone={nextStreakMileStone} />

                <Section title="Stats">
                    <PrimaryGoalCard goal={primaryGoal} />
                    <TopCategoryCard category={topCategory}/>
                </Section>

                <Section title="Recent">
                    {recentTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                    
                    <Button onClick={() => navigate("/transactions")}>View All Transactions</Button>
                </Section>
            </div>
        </div>
    )
}

export default Home