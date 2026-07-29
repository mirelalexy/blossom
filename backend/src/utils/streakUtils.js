import { parseLocalDate, getStartOfDay, getDayDiff } from "./dateUtils.js"

export function calculateStreak(transactions) {
    if (!transactions.length) return 0

    const today = getStartOfDay(new Date())

    const uniqueDays = [
        ...new Set(
            transactions
                .filter(t => t.date)
                .map(t => getStartOfDay(parseLocalDate(t.date)).getTime())
                // a future-dated recurring child should not be able to count for streak
                .filter(time => time <= today.getTime())
        )
    ].sort((a, b) => b - a)

    // if no transactions logged today, streak is 0
    if (uniqueDays[0] !== today.getTime()) return 0
    
    let streak = 1
    let currentDate = today

    for (let i = 1; i < uniqueDays.length; i++) {
        const transactionDate = new Date(uniqueDays[i])

        const diffDays = getDayDiff(currentDate, transactionDate)

        if (diffDays === 1) {
            streak++;
            currentDate = transactionDate
        } else {
            break
        }
    }

    return streak
}