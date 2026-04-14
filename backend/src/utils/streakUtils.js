export function calculateStreak(transactions) {
    if (!transactions.length) return 0

    const uniqueDays = [
        ...new Set(
            transactions
                .filter(t => t.date)
                .map(t => {
                    const d = new Date(t.date)
                    d.setHours(0, 0, 0, 0)
                    return d.getTime()
                })
        )
    ].sort((a, b) => b - a)

    let streak = 0
    let currentDate = new Date()

    // normalize today (set to midnight)
    currentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < uniqueDays.length; i++) {
        const transactionDate = new Date(uniqueDays[i])

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