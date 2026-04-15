import { parseLocalDate, getStartOfDay, getDayDiff } from "./dateUtils.js"

export function calculateStreak(transactions) {
    if (!transactions.length) return 0

    const uniqueDays = [
        ...new Set(
            transactions
                .filter(t => t.date)
                .map(t => getStartOfDay(parseLocalDate(t.date)).getTime())
        )
    ].sort((a, b) => b - a)

    let streak = 0
    let currentDate = getStartOfDay(new Date())

    for (let i = 0; i < uniqueDays.length; i++) {
        const transactionDate = new Date(uniqueDays[i])

        const diffDays = getDayDiff(currentDate, transactionDate)

        if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = transactionDate
        } else {
            break
        }
    }

    return streak
}