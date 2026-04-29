import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useGoals } from "../store/GoalsStore"
import { useCategories } from "../store/CategoryStore"
import { useUser } from "../store/UserStore"
import { useProfile } from "../store/ProfileStore"
import { useBudget } from "../store/BudgetStore"
import { useCurrency } from "../store/CurrencyStore"
import { useTheme } from "../store/ThemeStore"

import {
	getNextMilestone,
	getStreakMessage,
	isHighSpending,
	getRecentMood,
} from "../utils/streakUtils"

import {
	getNextMonthInfo,
	getGreeting,
	getTimeOfDay,
	getStartOfDay,
	parseLocalDate,
	getDayDiff
} from "../utils/dateUtils"

import { isEvilMode, getEvilBudgetMessage, getEvilGreeting } from "../utils/evilBlossom"
import { pickVoice } from "../utils/voice"

import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import StreakCard from "../components/home/StreakCard"
import BudgetSnapshotCard from "../components/home/BudgetSnapshotCard"
import LevelCard from "../components/profile/LevelCard"
import OnboardingFlow from "../components/home/OnboardingFlow"

import "../styles/pages/Home.css"

function Home() {
	const navigate = useNavigate()
	const { theme } = useTheme()

	const today = getStartOfDay(new Date())

	const { transactions } = useTransactions()
	const { getCategoryById } = useCategories()
	const { user } = useUser()
	const { stats } = useProfile()
	const { budget } = useBudget()
	const { currency } = useCurrency()

	const { goals } = useGoals()
	const primaryGoal = goals.find((g) => g.is_primary)

	const level = stats?.level || 1
    const levelTitle = stats?.levelTitle || "Mindful Seed"
    const levelProgress = stats?.progress || 0

	let streak = stats?.streak || 0
	const timeOfDay = getTimeOfDay()
	const recentMood = getRecentMood(transactions)
	const streakMessage = getStreakMessage({
		streak,
		recentMood,
		timeOfDay,
		isHighSpending,
		transactions,
	})
	const nextStreakMileStone = getNextMilestone(streak)

	const recentTransactions = transactions
		.filter((t) => {
			if (!t.date) return false

			const transactionDate = getStartOfDay(parseLocalDate(t.date))
			const diffDays = getDayDiff(today, transactionDate)

			return diffDays >= 0 && diffDays <= 7
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 3)

	function calculateTopCategory(transactions) {
		const now = new Date()
		const monthlyExpenses = transactions.filter((t) => {
			const date = parseLocalDate(t.date)

			return (
				t.type === "expense" &&
				t.categoryId &&
				date.getMonth() === now.getMonth() &&
				date.getFullYear() === now.getFullYear()
			)
		})

		const categoryTotals = {}

		monthlyExpenses.forEach((t) => {
			categoryTotals[t.categoryId] =
				(categoryTotals[t.categoryId] || 0) + t.amount
		})

		let topCategoryId = null
		let highestAmount = 0

		Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
			if (amount > highestAmount) {
				highestAmount = amount
				topCategoryId = categoryId
			}
		})

		return topCategoryId
	}

	const topCategoryId = calculateTopCategory(transactions)
	const topCategory = getCategoryById(topCategoryId)

	const message = getNextMonthInfo()
	const greeting = isEvilMode()
		? getEvilGreeting(user?.displayName)
		: getGreeting(user?.displayName)

	const isNewUser = transactions.length === 0

	// see how many onboarding steps are done
	const onboardingSteps = {
		hasTransaction: transactions.length > 0,
		hasGoal: goals.length > 0,
		hasBudget: budget?.monthly_limit > 0
	}

	const stepsCompleted = Object.values(onboardingSteps).filter(Boolean).length

	return (
		<div className="page">
			<GreetingHeader
				greeting={greeting}
				message={message}
				avatarSrc={user?.avatar}
			/>

			<StreakCard
				streak={streak}
				message={streakMessage}
				nextMileStone={nextStreakMileStone}
			/>

			{isNewUser ? (
				/* NEW USER FLOW */
				<OnboardingFlow
					steps={onboardingSteps}
					stepsCompleted={stepsCompleted}
					level={level}
					levelTitle={levelTitle}
					levelProgress={levelProgress}
					onNavigate={navigate}
					evil={isEvilMode()}
				/>
			) : (
				/* RETURNING USER FLOW */
				<>
					<LevelCard
						title={levelTitle}
						level={level}
						progress={levelProgress}
						variant="default"
						clickable
					/>

					<Section title="This Month">
						{budget?.monthly_limit > 0 && (
							<BudgetSnapshotCard
								transactions={transactions}
								budget={budget}
								currency={currency}
							/>
						)}

						<PrimaryGoalCard goal={primaryGoal} />
						{topCategory && (
							<TopCategoryCard category={topCategory} />
						)}
					</Section>

					<Section title="Recent">
						{recentTransactions.length === 0 ? (
							<div className="home-no-recent">
								<p className="secondary-text">
									{pickVoice(
										"Nothing logged in the last 7 days. Whenever you're ready, I'm here.",
										"Nothing logged in the last 7 days. I noticed."
									)}
								</p>
							
								<Button
									className="secondary"
									onClick={() => navigate("/transactions/add")}
								>
									Log something
								</Button>
							</div>	
						) : (
							<>
								{recentTransactions.map((t) => (
									<TransactionCard key={t.id} {...t} />
								))}

								<Button
									className="ghost" 
									onClick={() => navigate("/transactions")}
								>
									See everything →
								</Button>
							</>
						)}
					</Section>
				</>
			)}
		</div>
	)
}

export default Home
