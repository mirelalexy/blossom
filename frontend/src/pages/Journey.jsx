import { calculateXP, getLevelFromXP, getLevelProgress, getLevelTitle, getLevelNarrative } from "../utils/levelUtils"
import { useTransactions } from "../store/TransactionStore"
import { useChallenges } from "../store/ChallengeStore"
import { calculateStreak } from "../utils/streakUtils"

import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import LevelCard from "../components/profile/LevelCard"

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

    return (
        <div className="journey-content">
            <PageHeader title="Journey" />
            
            <LevelCard variant="hero" title={levelTitle} level={level} progress={progress} />

            <Section title="Your Journey So Far">
                <p className="journey-story">{levelStory}</p>
            </Section>
            
            <Section title="Your Patterns">

            </Section>

            <Section title="Statistics">

            </Section>

            <Section title="Insights">

            </Section>
        </div>
    )
}

export default Journey