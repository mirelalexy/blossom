import { calculateXP, getLevelFromXP, getLevelProgress, getLevelTitle, getLevelNarrative } from "../utils/levelUtils"
import { useTransactions } from "../store/TransactionStore"
import { useChallenges } from "../store/ChallengeStore"
import { calculateStreak } from "../utils/streakUtils"
import { getUserPatterns } from "../utils/patternUtils"
import { getStatistics } from "../utils/statisticsUtils"
import { useCurrency } from "../store/CurrencyStore"
import { getCategoryData, getChartColors, getSpendingOverTime, getIntentData, getMoodData, getIncomeExpenseData } from "../utils/chartUtils"
import { useCategories } from "../store/CategoryStore"

import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import LevelCard from "../components/profile/LevelCard"

import "../styles/pages/Journey.css"
import PatternCard from "../components/journey/PatternCard"
import StatCard from "../components/journey/StatCard"
import PieChart from "../components/charts/PieChart"
import LineChart from "../components/charts/LineChart"

function Journey() {
    const { transactions } = useTransactions()
    const streak = calculateStreak(transactions)
     const { challenges } = useChallenges()
    const completedChallenges = challenges.filter(c => c.completed).length

    const xp = calculateXP({
        transactions,
        streak,
        goalsCompleted: 0,
        weeklyLimitsHit: 0,
        completedChallenges
    })

    const level = getLevelFromXP(xp)
    const levelTitle = getLevelTitle(level)
    const progress = getLevelProgress(xp)
    const levelStory = getLevelNarrative(level)

    const patterns = getUserPatterns(transactions)
    console.log(patterns)

    const stats = getStatistics(transactions)
    const { currency } = useCurrency()

    const { categories } = useCategories()
    const colors = getChartColors()
    const categoryChartData = getCategoryData(transactions, categories, colors)
    console.log(categoryChartData)

    const spendingChartData = getSpendingOverTime(transactions)
    const intentChartData = getIntentData(transactions, colors)
    const moodChartData = getMoodData(transactions, colors)
    const incomeExpenseChartData = getIncomeExpenseData(transactions, colors)

    return (
        <div className="journey-content">
            <PageHeader title="Journey" />
            
            <LevelCard variant="hero" title={levelTitle} level={level} progress={progress} />

            <Section title="Your Journey So Far">
                <p className="journey-story">{levelStory}</p>
            </Section>
            
            <Section title="Your Patterns">
                {patterns.length > 0 ? (
                    patterns.map((p, index) => (
                        <PatternCard
                            key={index}
                            icon={p.icon}
                            text={p.text}
                        />
                    ))
                ) : (
                    <EmptyState title="Not enough data yet to show patterns." />
                )}
            </Section>

            <Section title="Statistics">
                <div className="stats-grid">
                    <StatCard label="Spent" value={`${stats.totalExpenses} ${currency}`} />
                    <StatCard label="Income" value={`${stats.totalIncome} ${currency}`} />
                    <StatCard label="Transactions" value={stats.count} />
                    <StatCard label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} />
                </div>
            </Section>

            <Section title="Insights" className="insights-section" >
                <div className="insights-chart">
                    <p className="subsection-title">Spending By Category</p>
                    <PieChart data={categoryChartData} />
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending Over Time</p>
                    <LineChart data={spendingChartData} />
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending By Intent</p>
                    <PieChart data={intentChartData} />
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending By Mood</p>
                    <PieChart data={moodChartData} />
                </div>
                <div className="insights-chart">
                    <p className="subsection-title">Income vs Expenses</p>
                    <PieChart data={incomeExpenseChartData} />
                </div>
            </Section>
        </div>
    )
}

export default Journey