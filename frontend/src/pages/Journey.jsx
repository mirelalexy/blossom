import { useTransactions } from "../store/TransactionStore"
import { useChallenges } from "../store/ChallengeStore"
import { useCurrency } from "../store/CurrencyStore"
import { useCategories } from "../store/CategoryStore"

import { getCategoryData, getChartColors, getSpendingOverTime, getIntentData, getMoodData, getIncomeExpenseData, getTopMerchantsData } from "../utils/chartUtils"
import { getCategoryInsight, getIntentInsight, getMoodInsight, getTimeInsight, getIncomeExpenseInsight, getBiggestExpense, getSpendingStyle, getSpendingStyleDetails } from "../utils/insightUtils"
import { isCurrentMonth, isLast30Days } from "../utils/dateUtils"
import { calculateXP, getLevelFromXP, getLevelProgress, getLevelTitle, getLevelNarrative } from "../utils/levelUtils"
import { calculateStreak } from "../utils/streakUtils"
import { getUserPatterns } from "../utils/patternUtils"
import { getStatistics } from "../utils/statisticsUtils"

import PageHeader from "../components/ui/PageHeader"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import LevelCard from "../components/profile/LevelCard"
import PatternCard from "../components/journey/PatternCard"
import StatCard from "../components/journey/StatCard"
import PieChart from "../components/charts/PieChart"
import LineChart from "../components/charts/LineChart"

import "../styles/pages/Journey.css"

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

    const monthlyTransactions = transactions.filter(t => isCurrentMonth(t.date))
    const recentTransactions = transactions.filter(t => isLast30Days(t.date))

    const patterns = getUserPatterns(recentTransactions)
    console.log(patterns)

    const stats = getStatistics(monthlyTransactions)
    const { currency } = useCurrency()

    const { categories } = useCategories()
    const colors = getChartColors()

    const categoryChartData = getCategoryData(monthlyTransactions, categories, colors)
    const spendingChartData = getSpendingOverTime(monthlyTransactions)
    const intentChartData = getIntentData(monthlyTransactions, colors)
    const moodChartData = getMoodData(monthlyTransactions, colors)
    const incomeExpenseChartData = getIncomeExpenseData(monthlyTransactions, colors)

    const { insight: categoryInsight, tip: categoryTip } = getCategoryInsight(categoryChartData)
    const { insight: intentInsight, tip: intentTip } = getIntentInsight(intentChartData)
    const { insight: moodInsight, tip: moodTip } = getMoodInsight(moodChartData)
    const { insight: timeInsight, tip: timeTip } = getTimeInsight(spendingChartData)
    const { insight: typeInsight, tip: typeTip } = getIncomeExpenseInsight(incomeExpenseChartData)

    const topMerchants = getTopMerchantsData(monthlyTransactions)
    console.log(topMerchants)

    const biggestExpense = getBiggestExpense(monthlyTransactions)
    const spendingStyle = getSpendingStyle({ moodData: moodChartData, intentData: intentChartData })

    return (
        <div className="journey-content">
            <PageHeader title="Journey" />
            
            <LevelCard variant="hero" title={levelTitle} level={level} progress={progress} />

            {spendingStyle && (
                <div className="highlight-card">
                    <p className="highlight-title">Your Spending Style</p>
                    <p className="highlight-value">{spendingStyle}</p>
                    <p>{getSpendingStyleDetails(spendingStyle)}</p>
                </div>
            )}

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

            {biggestExpense && (
                <div className="highlight-card">
                    <p>Your biggest expense this month was {biggestExpense.amount} {currency} at {biggestExpense.merchant}.</p>
                </div>
            )}

            <Section title="Where Your Money Goes Most">
                {topMerchants.map((merchant, i) => (
                    <div key={i} className="merchant-item">
                        <span>{merchant.name}</span>
                        <span>{merchant.value} {currency} </span>
                    </div>
                ))}
            </Section>

            <Section title="Insights" className="insights-section" >
                <div className="insights-chart">
                    <p className="subsection-title">Spending By Category</p>
                    <PieChart data={categoryChartData} />
                    <p>{categoryInsight}</p>
                    <p>{categoryTip}</p>
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending Over Time</p>
                    <LineChart data={spendingChartData} />
                    <p>{timeInsight}</p>
                    <p>{timeTip}</p>
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending By Intent</p>
                    <PieChart data={intentChartData} />
                    <p>{intentInsight}</p>
                    <p>{intentTip}</p>
                </div>

                <div className="insights-chart">
                    <p className="subsection-title">Spending By Mood</p>
                    <PieChart data={moodChartData} />
                    <p>{moodInsight}</p>
                    <p>{moodTip}</p>
                </div>
                <div className="insights-chart">
                    <p className="subsection-title">Income vs Expenses</p>
                    <PieChart data={incomeExpenseChartData} />
                    <p>{typeInsight}</p>
                    <p>{typeTip}</p>
                </div>
            </Section>
        </div>
    )
}

export default Journey