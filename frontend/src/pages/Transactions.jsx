import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import { useTransactions } from "../store/TransactionStore"
import { useNavigate } from "react-router-dom"

import { getNextRecurringDate } from "../utils/recurringUtils"

import "../styles/pages/Transactions.css"
import Icon from "../components/ui/Icon"

const monthlyBudget = 4000;

function Transactions() {
    const navigate = useNavigate()

    const { transactions } = useTransactions()

    const today = new Date()

    const formattedTransactions = transactions.map((t) => {
        if (t.recurring) {
            return {
                ...t,
                date: getNextRecurringDate(t.recurring)
            }
        }

        return t
    })

    const recentTransactions = formattedTransactions
        .filter((t) => {
            if (!t.date) return false

            const transactionDate = new Date(t.date)
            const diffDays = (today - transactionDate) / (1000 * 60 * 60 * 24)

            return diffDays >= 0 && diffDays <= 7
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const upcomingTransactions = formattedTransactions
        .filter((t) => {
            const transactionDate = new Date(t.date)

            return transactionDate > today
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    const expenses = transactions
        .filter(t => {
            if (t.type !== "Expense") return false

            const date = new Date(t.date)

            return (
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            )
        })
        .reduce((sum, t) => sum + t.amount, 0)

    const budgetLeft = monthlyBudget - expenses

    return (
        <div className="transactions-layout">
            <div className="transactions-content">
                <div className="transactions-header">
                    <div className="transactions-header-first-row">
                        <div className="filter-icon">
                            <Icon name="filter" size={22} />
                        </div>
                        <h1>Transactions</h1>
                        <div className="search-icon">
                            <Icon name="search" size={22} />
                        </div>
                    </div>
                    <h2 className="transactions-header-second-row">March 2026</h2>
                </div>

                <Section title="Overall" className="transactions-overall">
                    <div>
                        <p>Budget left: <span>{budgetLeft}</span></p>
                        <p>This month spent: <span>{expenses}</span></p>
                    </div>
                </Section>

                <Section title="Upcoming">
                    {upcomingTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                </Section>

                <Section title="Recent">
                    {recentTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                    
                    <Button onClick={() => navigate("/add-transaction")}>Add Transaction</Button>
                </Section>
            </div>
        </div>
    )
}

export default Transactions