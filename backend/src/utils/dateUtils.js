export function getCurrentMonthKey() {
    const now = new Date()
    return `${now.getFullYear()} - ${now.getMonth()}`
}

export function getCurrentWeekKey() {
    const now = new Date()

    // make a copy of date
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))

    // adjust since ISO weeks start on monday
    const dayNum = date.getUTCDay() || 7

    // set to nearest Thursday
    date.setUTCDate(date.getUTCDate() + 4 - dayNum)

    // get year
    const year = date.getUTCFullYear()

    // get first day of year
    const yearStart = new Date(Date.UTC(year, 0, 1))

    // calculate week number
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)

    return `${year}-week-${weekNo}`
}

export function parseLocalDate(dateInput) {
    if (!dateInput) return null

    // for date
    if (dateInput instanceof Date) {
        return new Date(
            dateInput.getFullYear(),
            dateInput.getMonth(),
            dateInput.getDate()
        )
    }

    // for string
    if (typeof dateInput === "string") {
        const [year, month, day] = dateInput.split("-").map(Number)
        return new Date(year, month - 1, day)
    }

    return null
}

export function getStartOfDay(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export function getDayDiff(a, b) {
    const diff = getStartOfDay(a) - getStartOfDay(b)
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function toDateStringLocal(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}