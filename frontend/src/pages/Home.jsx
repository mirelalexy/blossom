import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import { useTransactions } from "../store/TransactionStore"
import { useGoals } from "../store/GoalsStore"
import { getNextMonthInfo, getGreeting } from "../utils/dateUtils"
import { useNavigate } from "react-router-dom"

import "../styles/pages/Home.css"

function Home() {
    const navigate = useNavigate()

    const today = new Date()

    const { transactions } = useTransactions()

    const { goals } = useGoals()
    const primaryGoal = goals.find(g => g.primaryGoal)

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
                t.type === "Expense" && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            )
        })

        const categoryTotals = {}

        monthlyExpenses.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
        })

        let topCategory = null
        let highestAmount = 0

        Object.entries(categoryTotals).forEach(([category, amount]) => {
            if (amount > highestAmount) {
                highestAmount = amount
                topCategory = category
            }
        })

        return topCategory
    }

    const topCategory = calculateTopCategory(transactions)

    const username = localStorage.getItem("username") || "friend"
    const message = getNextMonthInfo()
    const greeting = getGreeting()

    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader greeting={greeting} username={username} message={message}/>

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