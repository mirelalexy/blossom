import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useCategories } from "../store/CategoryStore"
import { useProfile } from "../store/ProfileStore"

import { getCategoryData, getChartColors, getSpendingOverTime, getIntentData, getMoodData, getIncomeExpenseData, getTopSpendingSourcesData } from "../utils/chartUtils"
import { getCategoryInsight, getIntentInsight, getMoodInsight, getTimeInsight, getIncomeExpenseInsight, getBiggestExpense, getSpendingStyle, getSpendingStyleDetails } from "../utils/insightUtils"
import { isCurrentMonth, isLast30Days } from "../utils/dateUtils"
import { getLevelNarrative } from "../utils/levelUtils"
import { getUserPatterns } from "../utils/patternUtils"
import { getStatistics } from "../utils/statisticsUtils"
import { formatCurrency } from "../utils/currencyUtils"

import PageHeader from "../components/ui/PageHeader"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import LevelCard from "../components/profile/LevelCard"
import PatternCard from "../components/journey/PatternCard"
import StatCard from "../components/journey/StatCard"
import PieChart from "../components/charts/PieChart"
import LineChart from "../components/charts/LineChart"
import InsightChart from "../components/charts/InsightChart"

import "../styles/pages/Journey.css"

function Journey() {
    const { transactions } = useTransactions()
    const { stats: profileStats } = useProfile()
    const { currency } = useCurrency()
    
    const streak = profileStats?.streak || 0
    const level = profileStats?.level || 1
    const levelTitle = profileStats?.levelTitle || "Mindful Seed"
    const progress = profileStats?.progress || 0

    const levelStory = getLevelNarrative(level)

    const monthlyTransactions = transactions.filter(t => isCurrentMonth(t.date))
    const recentTransactions = transactions.filter(t => isLast30Days(t.date))

    const patterns = getUserPatterns(recentTransactions, currency)

    const stats = getStatistics(monthlyTransactions)

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
    const { insight: typeInsight, tip: typeTip } = getIncomeExpenseInsight(incomeExpenseChartData, currency)

    const topSpendingSources = getTopSpendingSourcesData(monthlyTransactions)

    const biggestExpense = getBiggestExpense(monthlyTransactions)
    const spendingStyle = getSpendingStyle({ moodData: moodChartData, intentData: intentChartData })

    return (
        <div className="page">
            <PageHeader title="Journey" />
            
            <LevelCard variant="hero" title={levelTitle} level={level} progress={progress} />

            <Section title="Your Journey So Far">
                <p className="journey-story">{levelStory}</p>
            </Section>

            {spendingStyle && (
                <div className="highlight-card">
                    <p className="highlight-title">Your Spending Style</p>
                    <p className="highlight-value">{spendingStyle}</p>
                    <p>{getSpendingStyleDetails(spendingStyle)}</p>
                </div>
            )}
            
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

            <Section title="Statistics">
                <div className="stats-grid">
                    <StatCard label="Spent" value={formatCurrency(stats.totalExpenses, currency)} />
                    <StatCard label="Income" value={formatCurrency(stats.totalIncome, currency)} />
                    <StatCard label="Transactions" value={stats.count} />
                    <StatCard label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} />
                </div>
            </Section>

            {biggestExpense && (
                <div className="highlight-card">
                    <p>Your biggest expense this month was {biggestExpense.amount} {currency} at {biggestExpense.title}.</p>
                </div>
            )}

            <Section title="Where Your Money Goes Most">
                {topSpendingSources.map((source, i) => (
                    <div key={i} className="source-item">
                        <span>{source.name}</span>
                        <span>{source.value} {currency} </span>
                    </div>
                ))}
            </Section>

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
        </div>
    )
}

export default Journey