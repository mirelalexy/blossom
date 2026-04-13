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