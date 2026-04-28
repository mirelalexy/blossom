import { useState, useMemo } from "react"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useCategories } from "../store/CategoryStore"
import { useProfile } from "../store/ProfileStore"

import { getCategoryData, getChartColors, getSpendingOverTime, getIntentData, getMoodData, getIncomeExpenseData, getTopSpendingSourcesData } from "../utils/chartUtils"
import { getCategoryInsight, getIntentInsight, getMoodInsight, getTimeInsight, getIncomeExpenseInsight, getBiggestExpense, getSpendingStyle, getSpendingStyleDetails } from "../utils/insightUtils"
import { isCurrentMonth, isLast30Days, parseLocalDate } from "../utils/dateUtils"
import { getLevelNarrative } from "../utils/levelUtils"
import { getUserPatterns } from "../utils/patternUtils"
import { getStatistics } from "../utils/statisticsUtils"
import { formatCurrency } from "../utils/currencyUtils"
import { toKey, isInMonth, prevMonthKey, labelFromKey, nextMonthKey } from "../utils/journeyUtils"

import PageHeader from "../components/ui/PageHeader"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import LevelCard from "../components/profile/LevelCard"
import PatternCard from "../components/journey/PatternCard"
import StatCard from "../components/journey/StatCard"
import PieChart from "../components/charts/PieChart"
import LineChart from "../components/charts/LineChart"
import InsightChart from "../components/charts/InsightChart"
import BlossomLoader from "../components/ui/BlossomLoader"

import "../styles/pages/Journey.css"

function Journey() {
    const { transactions, loading } = useTransactions()
    const { stats: profileStats } = useProfile()
    const { currency } = useCurrency()
    const { categories } = useCategories()
    
    const streak = profileStats?.streak || 0
    const level = profileStats?.level || 1
    const levelTitle = profileStats?.levelTitle || "Mindful Seed"
    const progress = profileStats?.progress || 0
    const levelStory = getLevelNarrative(level)

    if (loading) return <BlossomLoader />

    // month selector state
    const currentMonthKey = toKey(new Date())
    const [selectedMonth, setSelectedMonth] = useState(currentMonthKey)
    const isCurrentMonth = selectedMonth === currentMonthKey

    // find earliest month that has data
    const earliestKey = useMemo(() => {
        if (!transactions.length) return currentMonthKey

        const sorted = [...transactions]
            .sort((a, b) => new Date(a.date) - new Date(b.date))

        const d = parseLocalDate(sorted[0].date)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }, [transactions])

    const canGoPrev = selectedMonth > earliestKey
    const canGoNext = selectedMonth < currentMonthKey

    // filter transactions to selected month
    const monthlyTransactions = useMemo(
        () => transactions.filter(t => isInMonth(t.date, selectedMonth)),
        [transactions, selectedMonth]
    )

    // filter transactions from last 30 days
    const recentTransactions = useMemo(() => {
        const now = new Date()

        return transactions.filter(t => {
            const d = parseLocalDate(t.date)
            return d && (now - d) / 86400000 <= 30
        })
    }, [transactions])

    const colors = getChartColors()
    const patterns = getUserPatterns(recentTransactions, currency)
    const stats = getStatistics(monthlyTransactions)
    const categoryChartData = getCategoryData(monthlyTransactions, categories, colors)
    const spendingChartData = getSpendingOverTime(monthlyTransactions)
    const intentChartData = getIntentData(monthlyTransactions, colors)
    const moodChartData = getMoodData(monthlyTransactions, colors)
    const incomeExpenseChartData = getIncomeExpenseData(monthlyTransactions, colors)
    const topSpendingSources = getTopSpendingSourcesData(monthlyTransactions)
    const biggestExpense = getBiggestExpense(monthlyTransactions)
    const spendingStyle = getSpendingStyle({ moodData: moodChartData, intentData: intentChartData })

    const { insight: categoryInsight, tip: categoryTip } = getCategoryInsight(categoryChartData, currency)
    const { insight: intentInsight, tip: intentTip } = getIntentInsight(intentChartData, currency)
    const { insight: moodInsight, tip: moodTip } = getMoodInsight(moodChartData, currency)
    const { insight: timeInsight, tip: timeTip } = getTimeInsight(spendingChartData, currency)
    const { insight: typeInsight, tip: typeTip } = getIncomeExpenseInsight(incomeExpenseChartData, currency)

    const hasData = monthlyTransactions.length > 0

    return (
        <div className="page">
            <PageHeader title="Journey" />
            
            <LevelCard variant="hero" title={levelTitle} level={level} progress={progress} />

            <Section title="Your Journey So Far">
                <p className="journey-story">{levelStory}</p>
            </Section>

            {spendingStyle && (
                <div className="journey-style-card">
                    <p className="journey-style-label">Your Spending Style</p>
                    <p className="journey-style-value">{spendingStyle}</p>
                    <p className="journey-style-detail secondary-text">{getSpendingStyleDetails(spendingStyle)}</p>
                </div>
            )}

            <div className="month-selector">
                <button
                    className="month-arrow"
                    onClick={() => setSelectedMonth(prevMonthKey(selectedMonth))}
                    disabled={!canGoPrev}
                >
                    ←
                </button>

                <span className="month-label">
                    {labelFromKey(selectedMonth)}
                    {isCurrentMonth && <span className="month-current-badge">Current</span>}
                </span>

                <button
                    className="month-arrow"
                    onClick={() => setSelectedMonth(nextMonthKey(selectedMonth))}
                    disabled={!canGoNext}
                >
                    →
                </button>
            </div>
            
            {patterns.length > 0 && (
                <Section title="Your Patterns">
                    {patterns.map((p, index) => (
                        <PatternCard
                            key={index}
                            icon={p.icon}
                            text={p.text}
                            detail={p.detail}
                        />
                    ))}
                </Section>
            )}

            {!hasData ? (
                <EmptyState 
                    title="Nothing logged this month"
                    subtitle="Switch to a month with transactions to see your insights."
                />
            ) : (
                <>
                    <Section title="At a Glance">
                        <div className="stats-grid">
                            <StatCard label="Spent" value={formatCurrency(stats.totalExpenses, currency)} />
                            <StatCard label="Income" value={formatCurrency(stats.totalIncome, currency)} />
                            <StatCard label="Transactions" value={stats.count} />
                            <StatCard label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} />
                        </div>
                    </Section>

                    {biggestExpense && (
                        <div className="journey-highlight">
                            <p className="journey-highlight-label">Biggest Expense</p>
                            <p className="journey-highlight-value">{formatCurrency(biggestExpense.amount, currency)}</p>
                            <p className="secondary-text">{biggestExpense.title}</p>
                        </div>
                    )}
                    
                    {topSpendingSources.length > 0 && (
                        <Section title="Where Your Money Went">
                            {topSpendingSources.map((source, i) => (
                                <div key={i} className="source-item">
                                    <span className="source-rank">{i + 1}</span>
                                    <span className="source-name">{source.name}</span>
                                    <span className="source-amount">{formatCurrency(source.value, currency)}</span>
                                </div>
                            ))}
                        </Section>
                    )}

                    <Section title="Insights">
                        <InsightChart 
                            title="Spending By Category"
                            chart={<PieChart data={categoryChartData} />}
                            insight={categoryInsight}
                            tip={categoryTip}
                        />

                        <InsightChart 
                            title="Spending Over Time"
                            chart={<LineChart data={spendingChartData} />}
                            insight={timeInsight}
                            tip={timeTip}
                        />

                        <InsightChart 
                            title="Spending By Intent"
                            chart={<PieChart data={intentChartData} />}
                            insight={intentInsight}
                            tip={intentTip}
                        />

                        <InsightChart 
                            title="Spending By Mood"
                            chart={<PieChart data={moodChartData} />}
                            insight={moodInsight}
                            tip={moodTip}
                        />

                        <InsightChart 
                            title="Income vs Expenses"
                            chart={<PieChart data={incomeExpenseChartData} />}
                            insight={typeInsight}
                            tip={typeTip}
                        />
                    </Section>
                </>
            )}            
        </div>
    )
}

export default Journey