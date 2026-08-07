import { useNavigate, useLocation } from "react-router-dom"
import { useState, useMemo, useRef } from "react"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useBudget } from "../store/BudgetStore"
import { useCategories } from "../store/CategoryStore"

import { formatCurrency } from "../utils/currencyUtils"
import { filterTransactions } from "../utils/filterTransactions"
import { getStartOfDay, parseLocalDate } from "../utils/dateUtils"
import { searchTransactions } from "../utils/searchTransactions"
import { calculateBudgetWithRollover } from "../utils/budgetUtils"
import { toKey, isInMonth, prevMonthKey, nextMonthKey, labelFromKey } from "../utils/journeyUtils"
import { formatCategoryLabel, formatTypeLabel, formatIntentLabel, formatMoodLabel, formatDateRangeLabel } from "../utils/filterPillUtils"

import { getEmpty } from "../data/emptyStates"

import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import EmptyState from "../components/ui/EmptyState"
import FilterSheet from "../components/filters/FilterSheet"
import SearchBar from "../components/ui/SearchBar"
import PageHeader from "../components/ui/PageHeader"
import MonthSelector from "../components/ui/MonthSelector"
import FilterPill from "../components/filters/FilterPill"

import "../styles/pages/Transactions.css"

const PAGE_SIZE = 10

function Transactions() {
	const navigate = useNavigate()
	const location = useLocation()

	const [searchQuery, setSearchQuery] = useState("")
	const [showSearch, setShowSearch] = useState(false)
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	const { transactions } = useTransactions()
	const { currency } = useCurrency()
	const { budget } = useBudget()
	const { categories } = useCategories()

	// only one filter pill's menu opens at a time
	const [openFilterId, setOpenFilterId] = useState(null)
	
	const categoryPillRef = useRef(null)
	const typePillRef = useRef(null)
	const intentPillRef = useRef(null)
	const moodPillRef = useRef(null)
	const dateRangePillRef = useRef(null)

	const today = getStartOfDay(new Date())

	// month selector state (following the same pattern as Journey)
	const currentMonthKey = toKey(today)
	const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
	const isCurrentMonth = selectedMonth === currentMonthKey

	const earliestKey = useMemo(() => {
		if (!transactions.length) return currentMonthKey
	
		const sorted = [...transactions].sort(
			(a, b) => new Date(a.date) - new Date(b.date)
		)
	
		return toKey(parseLocalDate(sorted[0].date))
	}, [transactions, currentMonthKey])
	
	const canGoPrev = selectedMonth > earliestKey
	const canGoNext = selectedMonth < currentMonthKey

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

			const date = getStartOfDay(parseLocalDate(t.date))

			if (date > today) return false

			return isInMonth(t.date, selectedMonth)
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date))

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
		upcomingTransactions.length === 0 && monthlyTransactions.length === 0

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
			?   {
					start: firstDayOfMonth,
					end: lastDayOfMonth,
			    }
			:   {
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

	function clearFilter(field) {
		if (field === "period") {
			updateFilter("period", { start: "", end: "" })
		} else {
			updateFilter(field, "")
		}
	}

	// if income is selected, there is no intent to filter after
	const isIncomeSelected = filters.type === "income"

	const filteredTransactions = filterTransactions(
		transactions.filter((t) => !t.is_recurring),
		filters
	)

	const searchedTransactions = searchTransactions(
		filteredTransactions,
		searchQuery
	)

	// pagination
	const paginatedFiltered = searchedTransactions.slice(0, visibleCount)
	const hasMore = searchedTransactions.length > visibleCount
	const paginatedMonth = monthlyTransactions.slice(0, visibleCount)
	const monthHasMore = monthlyTransactions.length > visibleCount

	const categoryOptions = [
        { value: "", label: "All categories" },
        ...categories
            .filter(c => !c.id.includes("other"))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({
                value: c.id,
                label: c.name
            })),
        // make Other last option
        ...categories
            .filter(c => c.id.includes("other"))
            .map(c => ({
                value: c.id,
                label: c.name
            })),
    ]

	return (
		<div className="page">
			<PageHeader
                title={hasActiveFilters ? "Filtered" : "Transactions"}
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

			<div className="filter-pill-row">
				{hasActiveFilters && (
					<button
						className="filter-pill-clear-all"
						onClick={() => {
							clearFilter("category")
							clearFilter("type")
							clearFilter("intent")
							clearFilter("mood")
							clearFilter("period")
							setSearchQuery("")
						}}
					>
						<Icon name="close" size={20} />
					</button>
				)}
				
				<FilterPill
					pillRef={categoryPillRef}
					label="Category"
					value={formatCategoryLabel(filters.category, categories)}
					onClick={() => setOpenFilterId("category")}
					onClear={() => clearFilter("category")}
				/>
			
				<FilterPill
					pillRef={typePillRef}
					label="Type"
					value={formatTypeLabel(filters.type)}
					onClick={() => setOpenFilterId("type")}
					onClear={() => clearFilter("type")}
				/>
			
				<FilterPill
					pillRef={intentPillRef}
					label="Intent"
					value={formatIntentLabel(filters.intent)}
					onClick={() => setOpenFilterId("intent")}
					onClear={() => clearFilter("intent")}
					disabled={isIncomeSelected}
				/>
			
				<FilterPill
					pillRef={moodPillRef}
					label="Mood"
					value={formatMoodLabel(filters.mood)}
					onClick={() => setOpenFilterId("mood")}
					onClear={() => clearFilter("mood")}
				/>
			
				<FilterPill
					pillRef={dateRangePillRef}
					label="Date Range"
					value={formatDateRangeLabel(filters.period)}
					onClick={() => setOpenFilterId("dateRange")}
					onClear={() => clearFilter("period")}
				/>
			</div>

			{!hasActiveFilters && (
				<MonthSelector
					label={labelFromKey(selectedMonth)}
					isCurrentMonth={isCurrentMonth}
					canGoPrev={canGoPrev}
					canGoNext={canGoNext}
					onPrev={() => setSelectedMonth(prevMonthKey(selectedMonth))}
					onNext={() => setSelectedMonth(nextMonthKey(selectedMonth))}
				/>
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
							{...(
								searchQuery
									? getEmpty("transactionsSearch", searchQuery)
									: getEmpty("transactionsFiltered")
							)}
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
						{...getEmpty("transactions")}
						action={
							<Button
								onClick={() => navigate("/transactions/add")}
							>
								Log something
							</Button>
						}
					/>
				</Section>
			) : (
				<>
					{isCurrentMonth && (
						<Section title="Upcoming">
							{upcomingTransactions.length === 0 ? (
								<EmptyState {...getEmpty("transactionsUpcoming")} />
							) : (
								upcomingTransactions.map((t) => (
									<TransactionCard key={t.id} {...t} />
								))
							)}
						</Section>
					)}
					
					<Section title="This Month">
						{monthlyTransactions.length === 0 ? (
							<EmptyState {...getEmpty("transactionsMonth")} />
						) : (
							<>
								{paginatedMonth.map((t) => (
									<TransactionCard key={t.id} {...t} />
								))}

								{monthHasMore && (
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
		</div>
	)
}

export default Transactions
