import { parseLocalDate } from "./dateUtils.js"

export function getUserPatterns(transactions) {
    const patterns = []

    if (!transactions || transactions.length === 0) return patterns

    // weekend pattern
    const weekendSpending = transactions.filter(t => {
        const day = parseLocalDate(t.date).getDay()
        return day === 0 || day === 6
    }).length

    const weekdaySpending = transactions.length - weekendSpending

    if (weekendSpending > weekdaySpending) {
        patterns.push({
            icon: "calendar",
            text: "Most of your spending happens on weekends."
        })
    }

    // mood pattern
    const moodCount = {}

    transactions.forEach(t => {
        if (!t.mood) return

        moodCount[t.mood] = (moodCount[t.mood] || 0) + 1
    })

    const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]

    if (topMood) {
        const [mood] = topMood

        patterns.push({
            icon: "leaf",
            text: `You tend to spend more when feeling ${mood}.`
        })    
    }

    // intent pattern
    const intentCount = {}

    transactions.forEach(t => {
        if (!t.intent) return

        intentCount[t.intent] = (intentCount[t.intent] || 0) + 1
    })

    const topIntent = Object.entries(intentCount).sort((a, b) => b[1] - a[1])[0]

    if (topIntent) {
        const [intent] = topIntent

        if (intent === "necessary") {
            patterns.push({
                icon: "tags",
                text: "Most of your spending goes toward essentials."
            })    
        } else if (intent === "planned") {
            patterns.push({
                icon: "sparkles",
                text: "You tend to plan your spending ahead."
            })   
        } else if (intent === "impulse") {
            patterns.push({
                icon: "zap",
                text: "Most of your spending happens on impulse."
            })    
        }
    }

    return patterns
}