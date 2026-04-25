import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useBudget } from "../store/BudgetStore"

import { formatCurrency } from "../utils/currencyUtils"
import { filterTransactions } from "../utils/filterTransactions"
import { getCurrentMonthYear, getDayDiff, getStartOfDay, parseLocalDate } from "../utils/dateUtils"
import { searchTransactions } from "../utils/searchTransactions"
import { calculateBudgetWithRollover } from "../utils/budgetUtils"

import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import EmptyState from "../components/ui/EmptyState"
import FilterSheet from "../components/filters/FilterSheet"
import SearchBar from "../components/ui/SearchBar"
import PageHeader from "../components/ui/PageHeader"

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

	const today = getStartOfDay(new Date())

	const recentTransactions = transactions
		.filter((t) => {
			if (!t.date) return false

			const transactionDate = getStartOfDay(parseLocalDate(t.date))
			const diffDays = getDayDiff(today, transactionDate)

			return diffDays >= 0 && diffDays <= 7
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date))

	const upcomingTransactions = transactions
		.filter((t) => {
			if (t.is_recurring) return false
			
			const d = getStartOfDay(parseLocalDate(t.date))
			if (d <= today) return false

			// show only for this month
			return (
				d.getMonth() === today.getMonth() &&
				d.getFullYear() === today.getFullYear()
			)
		})
		.sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date))

	const monthlyTransactions = transactions
		.filter((t) => {
			if (!t.date) return false

			const date = parseLocalDate(t.date)

			return (
				date.getMonth() === today.getMonth() &&
				date.getFullYear() === today.getFullYear()
			)
		})

	const expenses = monthlyTransactions
		.filter((t) => t.type === "expense")
		.reduce((sum, t) => sum + t.amount, 0)

	const income = monthlyTransactions
		.filter((t) => t.type === "income")
		.reduce((sum, t) => sum + t.amount, 0)

	const effectiveBudget = calculateBudgetWithRollover({
		transactions,
		budget,
	})

	const budgetLeft = effectiveBudget - expenses

	const isOverBudget = budgetLeft < 0

	const baseBudget = budget?.monthly_limit || 0
	const rolloverAmount = effectiveBudget - baseBudget

	const noTransactions =
		upcomingTransactions.length === 0 && recentTransactions.length === 0

	const topCategoryId = location.state?.categoryId || ""

	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
		.toISOString()
		.split("T")[0]
	const lastDayOfMonth = new Date(
		today.getFullYear(),
		today.getMonth() + 1,
		0,
	)
		.toISOString()
		.split("T")[0]

	const [filters, setFilters] = useState({
		category: topCategoryId,
		type: "",
		intent: "",
		mood: "",
		period: topCategoryId
			? {
					start: firstDayOfMonth,
					end: lastDayOfMonth,
				}
			: {
					start: "",
					end: "",
				},
	})

	const hasActiveFilters =
		filters.category ||
		filters.type ||
		filters.intent ||
		filters.mood ||
		filters.period.start ||
		filters.period.end ||
		searchQuery

	function updateFilter(field, value) {
		setVisibleCount(PAGE_SIZE)
		setFilters((prev) => {
			const updated = {
				...prev,
				[field]: value,
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

	const filteredTransactions = filterTransactions(
		transactions.filter((t) => !t.is_recurring),
		filters,
	)
	const [showFilters, setShowFilters] = useState(false)

	const searchedTransactions = searchTransactions(
		filteredTransactions,
		searchQuery,
	)

	// pagination
	const paginatedFiltered = searchedTransactions.slice(0, visibleCount)
	const hasMore = searchedTransactions.length > visibleCount
	const paginatedRecent = recentTransactions.slice(0, visibleCount)
	const recentHasMore = recentTransactions.length > visibleCount

	return (
		<div className="page">
			<PageHeader
                title={hasActiveFilters ? "Filtered" : currentMonthYear}
                left={
                    <button
                        className={`page-header-left ${hasActiveFilters ? "header-btn-active" : ""}`}
                        onClick={() => setShowFilters(true)}
                    >
                        <Icon name="filter" size={18} />
                    </button>
                }
                right={
                    <button
                        className={`page-header-right ${showSearch ? "header-btn-active" : ""}`}
                        onClick={() => { 
							setShowSearch(p => !p); 
							setSearchQuery("") 
						}}
                    >
                        <Icon name="search" size={18} />
                    </button>
                }
            />

			{showSearch && (
				<SearchBar value={searchQuery} onChange={setSearchQuery} />
			)}

			{!hasActiveFilters && (
				<div className="transactions-overview">
					<div className="overview-stat">
						<span className="overview-stat-label">Spent</span>
						<span className={`overview-stat-value ${isOverBudget ? "over-budget" : ""}`}>
							{formatCurrency(expenses, currency)}
						</span>
					</div>
					
					<div className="overview-divider" />
					
					<div className="overview-stat">
						<span className="overview-stat-label">Income</span>
						<span className="overview-stat-value">
							{formatCurrency(income, currency)}
						</span>
					</div>
					
					{baseBudget > 0 && (
						<>
							<div className="overview-divider" />
								<div className="overview-stat">
									<span className="overview-stat-label">
										{isOverBudget ? "Over by" : "Left"}
									</span>
									
									<span className={`overview-stat-value ${isOverBudget ? "over-budget" : "under-budget"}`}>
										{formatCurrency(Math.abs(budgetLeft), currency)}
									</span>
							</div>
						</>
					)}
					
					{budget?.rollover === "next_month" && rolloverAmount > 0 && (
						<p className="overview-rollover">
							Includes {formatCurrency(rolloverAmount, currency)} rolled over from last month
						</p>
					)}
				</div>
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
									onClick={() =>
										setVisibleCount((c) => c + PAGE_SIZE)
									}
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
							<Button
								onClick={() => navigate("/transactions/add")}
							>
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
										onClick={() =>
											setVisibleCount(
												(c) => c + PAGE_SIZE,
											)
										}
									>
										Load more
									</Button>
								)}
							</>
						)}

						<Button onClick={() => navigate("/transactions/add")}>
							Add Transaction
						</Button>
					</Section>
				</>
			)}

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
