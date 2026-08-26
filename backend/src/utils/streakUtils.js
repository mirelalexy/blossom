import { getTodayKeyInTimezone, getDayKeyInTimezone } from "./dateUtils.js"

export function calculateStreak(transactions, checkIns, tz = "UTC") {
    if (!transactions.length && !checkIns.length) return 0

    const todayKey = getTodayKeyInTimezone(tz)

    // a day counts if user logged a transaction or checked in
    const allDates = [
        ...transactions.filter(t => t.created_at).map(t => t.created_at),
        ...checkIns.filter(c => c.created_at).map(c => c.created_at)
    ]

    const uniqueDayKeys = [
        ...new Set(
            allDates
                .map(date => getDayKeyInTimezone(date, tz))
                // a future-dated recurring child should not be able to count for streak
                .filter(dayKey => dayKey <= todayKey)
        )
    ].sort((a, b) => (a < b ? 1 : -1))

    // if no transactions logged today, streak is 0
    if (uniqueKeyDays[0] !== todayKey) return 0
    
    let streak = 1
    let currentDayKey = todayKey

    for (let i = 1; i < uniqueDayKeys.length; i++) {
        const entryDate = new Date(uniqueDayKeys[i])

        const diffDays = getDayKeyDiff(currentDayKey, entryDate)

        if (diffDays === 1) {
            streak++
            currentDayKey = entryDate
        } else {
            break
        }
    }

    return streak
}