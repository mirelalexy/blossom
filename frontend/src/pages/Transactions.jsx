import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useBudget } from "../store/BudgetStore"

import { getNextRecurringDate } from "../utils/recurringUtils"
import { formatCurrency } from "../utils/currencyUtils"
import { filterTransactions } from "../utils/filterTransactions"
import { getCurrentMonthYear } from "../utils/dateUtils"
import { searchTransactions } from "../utils/searchTransactions"
import { calculateBudgetWithRollover } from "../utils/budgetUtils"

import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import EmptyState from "../components/ui/EmptyState"
import FilterSheet from "../components/filters/FilterSheet"
import SearchBar from "../components/ui/SearchBar"

import "../styles/pages/Transactions.css"

const PAGE_SIZE = 10

function Transactions() {
    const navigate = useNavigate()
    const location = useLocation()

    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const currentMonthYear = getCurrentMonthYear()

    const { transactions } = useTransactions()
    const { currency } = useCurrency()
    const { budget } = useBudget()

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

    const monthlyTransactions = formattedTransactions.filter(t => {
        if (!t.date) return false

        const date = new Date(t.date)

        return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    })

    const expenses = monthlyTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)
        

    const income = monthlyTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const effectiveBudget = calculateBudgetWithRollover({ transactions, budget })

    const budgetLeft = effectiveBudget - expenses

    const isOverBudget = budgetLeft < 0

    const baseBudget = budget?.monthly_limit || 0
    const rolloverAmount = effectiveBudget - baseBudget

    const noTransactions = upcomingTransactions.length === 0 && recentTransactions.length === 0

    const topCategoryId = location.state?.categoryId || ""

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0]
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0]

    const [filters, setFilters] = useState({
        category: topCategoryId,
        type: "",
        intent: "",
        mood: "",
        period: topCategoryId
            ? {
                start: firstDayOfMonth,
                end: lastDayOfMonth
            }
            : {
                start: "",
                end: ""
            }
    })

    const hasActiveFilters = filters.category || filters.type || filters.intent || filters.mood || filters.period.start || filters.period.end || searchQuery
    
    function updateFilter(field, value) {
        setVisibleCount(PAGE_SIZE)
        setFilters(prev => {
            const updated = {
                ...prev,
                [field]: value
            }

            if (field === "type") {
                updated.category = ""

                if (value === "income") {
                    updated.intent = ""
                }
            }

            return updated
        })
    }

    const filteredTransactions = filterTransactions(formattedTransactions, filters)
    const [showFilters, setShowFilters] = useState(false)

    const searchedTransactions = searchTransactions(filteredTransactions, searchQuery)

    // pagination
    const paginatedFiltered = searchedTransactions.slice(0, visibleCount)
    const hasMore = searchedTransactions.length > visibleCount
    const paginatedRecent = recentTransactions.slice(0, visibleCount)
    const recentHasMore = recentTransactions.length > visibleCount

    return (
        <div className="transactions-layout">
            <div className="transactions-content">
                <div className="transactions-header">
                    <div className="transactions-header-first-row">
                        <div className="filter-icon" onClick={() => setShowFilters(true)}>
                            <Icon name="filter" size={22} />
                        </div>
                        <h1>Transactions</h1>
                        <div className="search-icon" onClick={() => setShowSearch((prev) => !prev)}>
                            <Icon name="search" size={22} />
                        </div>
                    </div>
                    {!hasActiveFilters && (
                        <h2 className="transactions-header-second-row">{currentMonthYear}</h2>
                    )}
                </div>

                {showSearch && (
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                )}

                {!hasActiveFilters && (
                    <Section title="Overall" className="transactions-overall">
                        <div>
                            <p>Budget left: <span className={isOverBudget ? "red-text" : ""}>{formatCurrency(budgetLeft, currency)}</span></p>
                            
                            {budget?.rollover === "next_month" && rolloverAmount > 0 && (
                                <p>Includes {formatCurrency(rolloverAmount, currency)} rolled over</p>
                            )} 
                            
                            <p>This month spent: <span>{formatCurrency(expenses, currency)}</span></p>
                            <p>This month gained: <span>{formatCurrency(income, currency)}</span></p>
                        </div>
                    </Section>
                )}
                
                {hasActiveFilters ? (
                    <Section title={`Results (${searchedTransactions.length})`}>
                        {searchedTransactions.length === 0 ? (
                            <EmptyState 
                                title={
                                    searchQuery
                                        ? `No transactions found for "${searchQuery}".`
                                        : "No transactions match your filters."
                                }
                            />
                        ) : (
                            <>
                            {paginatedFiltered.map((t) => (
                                <TransactionCard key={t.id} {...t} />
                            ))}

                            {hasMore && (
                                <Button 
                                    className="secondary" 
                                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                >
                                    Load more
                                </Button>
                            )}
                            </>
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
                            <>
                            {paginatedRecent.map((t) => (
                                <TransactionCard key={t.id} {...t} />
                            ))}

                            {recentHasMore && (
                                <Button 
                                    className="secondary" 
                                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                >
                                    Load more
                                </Button>
                            )}
                            </>
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