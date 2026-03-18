export function calculateStreak(transactions) {
    if (!transactions.length) return 0

    // sort by date desc
    const sorted = [...transactions]
        .filter(t => t.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    let streak = 0
    let currentDate = new Date()

    // normalize today (set to midnight)
    currentDate.setHours(0, 0, 0, 0)

    // count unique days
    const uniqueDays = [
        ...new Set(sorted.map(t => t.date))
    ]

    for (let i = 0; i < uniqueDays.length; i++) {
        const transactionDate = new Date(uniqueDays[i])

        // normalize transaction date
        transactionDate.setHours(0, 0, 0, 0)

        const diffDays = Math.floor((currentDate - transactionDate) / (1000 * 60 * 60 * 24))

        if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = transactionDate
        } else {
            break
        }
    }

    return streak
}