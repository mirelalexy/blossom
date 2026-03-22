import { XP } from "./xpConfig"

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

export function calculateXP({ transactions, streak, goalsCompleted = 0, weeklyLimitsHit = 0, completedChallenges = 0 }) {
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

export function getLevelTitle(level) {
    let currentTitle = "Growing Soul"

    const sortedLevels = Object.keys(levelMilestones)
        .map(Number)
        .sort((a, b) => a - b)

    for (let l of sortedLevels) {
        if (level >= l) {
            currentTitle = levelMilestones[l]
        }
    }

    return currentTitle
}

export function getLevelProgress(xp) {
    let level = 1
    let totalXP = 0

    while(true) {
        const needed = getXPForLevel(level)

        if (xp < totalXP + needed) {
            const progress = (xp - totalXP) / needed
            return Math.min(progress * 100, 100)
        }

        totalXP += needed
        level++
    }
}

export function getLevelNarrative(level) {
    if (level >= 100) {
        return `This is no longer something you're trying to improve.
                Your habits are steady and your decisions feel natural.
                You're not chasing progress anymore...`
    }
    if (level >= 50) {
        return `There's a deep sense of control in your actions now.
                You understand your patterns, your impulses, and your priorities.
                What once required effort now feels natural, almost instinctive.`
    }
    if (level >= 30) {
        return `You've built something stable.
                Your habits aren't random anymore. They have become part of your routine, something you can rely on.
                There's a quiet strength in your consistency, and it shows in the way you make decisions.`
    }
    if (level >= 10) {
        return `Something has shifted.
                You pause more, think more, and act with a bit more intention.
                Your habits are starting to feel grounded, like they're becoming part of who you are.`
    }
    if (level >= 5) {
        return `You're beginning to notice your patterns.
                Some habits are forming, even if they're not perfect yet.`
    }

    return `You've just started paying attention and that matters more than it seems.
            Not everything feels clear yet, but something is shifting.
            Awareness is the first step, and you've already taken it.`
}