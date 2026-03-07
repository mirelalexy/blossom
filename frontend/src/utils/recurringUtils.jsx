export function getNextRecurringDate(recurring) {
    const today = new Date()

    if (recurring.frequency === "monthly") {
        const next = new Date(
            today.getFullYear(),
            today.getMonth(),
            recurring.dayOfMonth
        )

        if (next < today) {
            next.setMonth(next.getMonth() + 1)
        }

        return next.toISOString().split("T")[0]
    }

    return null
}