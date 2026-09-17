import { getTodayKeyInTimezone, getDayKeyInTimezone, getDayKeyDiff } from "./dateUtils.js"

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
    if (uniqueDayKeys[0] !== todayKey) return 0
    
    let streak = 1
    let currentDayKey = todayKey

    for (let i = 1; i < uniqueDayKeys.length; i++) {
        const entryDate = uniqueDayKeys[i]

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

export function calculatePeakStreak(transactions, checkIns, monthKey, tz = "UTC") {
    const allDates = [
        ...transactions.filter(t => t.created_at && !t.recurring_parent_id).map(t => t.created_at),
        ...checkIns.filter(c => c.created_at).map(c => c.created_at)
    ]

    const uniqueDayKeys = [...new Set(allDates.map(date => getDayKeyInTimezone(date, tz)))].sort()

    if (uniqueDayKeys.length === 0) return 0

    let peakInMonth = 0
    let current = 1

    for (let i = 0; i < uniqueDayKeys.length; i++) {
        if (i > 0) {
            const diff = getDayKeyDiff(uniqueDayKeys[i], uniqueDayKeys[i - 1])
            current = diff === 1 ? current + 1 : 1
        }

        if (uniqueDayKeys[i].startsWith(monthKey)) {
            peakInMonth = Math.max(peakInMonth, current)
        }
    }

    return peakInMonth
}