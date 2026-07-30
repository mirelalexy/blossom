import { parseLocalDate, getStartOfDay, getDayDiff } from "./dateUtils.js"

export function calculateStreak(transactions, checkIns) {
    if (!transactions.length && !checkIns.length) return 0

    const today = getStartOfDay(new Date())

    // a day counts if user logged a transaction or checked in
    const allDates = [
        ...transactions.filter(t => t.date).map(t => t.date),
        ...checkIns.filter(c => c.date).map(c => c.date)
    ]

    const uniqueDays = [
        ...new Set(
            allDates
                .map(date => getStartOfDay(parseLocalDate(date)).getTime())
                // a future-dated recurring child should not be able to count for streak
                .filter(time => time <= today.getTime())
        )
    ].sort((a, b) => b - a)

    // if no transactions logged today, streak is 0
    if (uniqueDays[0] !== today.getTime()) return 0
    
    let streak = 1
    let currentDate = today

    for (let i = 1; i < uniqueDays.length; i++) {
        const entryDate = new Date(uniqueDays[i])

        const diffDays = getDayDiff(currentDate, entryDate)

        if (diffDays === 1) {
            streak++;
            currentDate = entryDate
        } else {
            break
        }
    }

    return streak
}