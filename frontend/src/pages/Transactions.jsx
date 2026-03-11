import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import EmptyState from "../components/ui/EmptyState"
import FilterSheet from "../components/filters/FilterSheet"

import { useTransactions } from "../store/TransactionStore"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { getNextRecurringDate } from "../utils/recurringUtils"
import { formatCurrency } from "../utils/currencyUtils"
import { filterTransactions } from "../utils/filterTransactions"

import "../styles/pages/Transactions.css"

const monthlyBudget = 4000;
const currency = "RON"

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

    const monthlyTransactions = transactions.filter(t => {
        if (!t.date) return false

        const date = new Date(t.date)

        return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    })

    const expenses = monthlyTransactions
        .filter(t => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const income = monthlyTransactions
        .filter(t => t.type === "Income")
        .reduce((sum, t) => sum + t.amount, 0)

    const budgetLeft = monthlyBudget - expenses

    const noTransactions = upcomingTransactions.length === 0 && recentTransactions.length === 0

    const [filters, setFilters] = useState({
        category: "",
        type: "",
        intent: ""
    })

    const hasActiveFilters = filters.category || filters.type || filters.intent
    
    function updateFilter(field, value) {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const filteredTransactions = filterTransactions(formattedTransactions, filters)
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="transactions-layout">
            <div className="transactions-content">
                <div className="transactions-header">
                    <div className="transactions-header-first-row">
                        <div className="filter-icon" onClick={() => setShowFilters(true)}>
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
                        <p>Budget left: <span>{formatCurrency(budgetLeft, currency)}</span></p>
                        <p>This month spent: <span>{formatCurrency(expenses, currency)}</span></p>
                        <p>This month gained: <span>{formatCurrency(income, currency)}</span></p>
                    </div>
                </Section>

                {hasActiveFilters ? (
                    <Section title={`Results (${filteredTransactions.length})`}>
                        {filterTransactions.length === 0 ? (
                            <EmptyState title="No transactions match your filters." />
                        ) : (
                            filteredTransactions.map((t) => (
                                <TransactionCard key={t.id} {...t} />
                            ))
                        )}
                    </Section>
                ) : noTransactions ? (
                    <Section title="Transactions">
                        <EmptyState 
                            title="You haven't added any transactions yet 🌸"
                            subtitle="Start by adding your first one."
                            action={
                                <Button onClick={() => navigate("/add-transaction")}>
                                    Add Transaction
                                </Button>
                            }
                        />
                    </Section>
                ) : (
                    <>
                        <Section title="Upcoming">
                        {upcomingTransactions.length === 0 ? (
                            <EmptyState title="No upcoming transactions." />
                        ) : (
                            upcomingTransactions.map((t) => (
                                <TransactionCard key={t.id} {...t} />
                            ))
                        )}
                    </Section>

                    <Section title="Recent">
                        {recentTransactions.length === 0 ? (
                            <EmptyState title="No recent transactions yet." />
                        ) : (
                            recentTransactions.map((t) => (
                                <TransactionCard key={t.id} {...t} />
                            ))
                        )}
                        
                        <Button onClick={() => navigate("/add-transaction")}>Add Transaction</Button>
                    </Section>
                    </>
                )}
            </div>

            {showFilters && (
                <FilterSheet 
                    filters={filters}
                    updateFilter={updateFilter}
                    onClose={() => setShowFilters(false)}
                />
            )}
        </div>
    )
}

export default Transactions