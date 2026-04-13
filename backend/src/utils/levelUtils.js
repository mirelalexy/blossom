import { XP } from "./xpConfig.js"

export const levelMilestones = {
    1: "Mindful Seed",
    2: "Mindful Sprout",
    3: "Steady Bloom",
    5: "Rooted Growth",
    10: "Flourishing Mind",
    30: "Unshakable Bloom",
    50: "Golden Garden",
    100: "Eternal Bloom"
}

export function calculateXP({ transactions, streak = 0, goalsCompleted = 0, weeklyLimitsHit = 0, completedChallenges = 0 }) {
    const transactionXP = transactions.length * XP.TRANSACTION
    const streakXP = streak * XP.STREAK_PER_DAY
    const goalsXP = goalsCompleted * XP.GOAL_COMPLETED
    const limitsXP = weeklyLimitsHit * XP.WEEKLY_LIMIT_RESPECTED
    const challengesXP = completedChallenges * XP.CHALLENGE_COMPLETED

    return transactionXP + streakXP + goalsXP + limitsXP + challengesXP
}

export function getXPForLevel(level) {
    if (level <= 3) return level * 30 // fast early

    return Math.floor(80 + level * 35) // slower later
}

export function getLevelFromXP(xp) {
    let level = 1
    let totalXP = 0

    while(true) {
        const needed = getXPForLevel(level)

        if (xp < totalXP + needed) break

        totalXP += needed
        level++
    }

    return level
}