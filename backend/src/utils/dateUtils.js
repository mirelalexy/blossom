const VALID_TIMEZONES = new Set(Intl.supportedValuesOf("timeZone"))

export function isValidTimezone(tz) {
    return typeof tz === "string" && VALID_TIMEZONES.has(tz)
}

export function getDayKeyInTimezone(date, tz = "UTC") {
    const d = date instanceof Date ? date : new Date(date)

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(d)
}

export function getTodayKeyInTimezone(tz = "UTC") {
    return getDayKeyInTimezone(new Date(), tz)
}

export function parseDayKeyToUTCDate(dayKey) {
    const [year, month, day] = dayKey.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

export function getDayKeyDiff(dayKey1, dayKey2) {
    const diff = parseDayKeyToUTCDate(dayKey1) - parseDayKeyToUTCDate(dayKey2)
    return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function getMonthKey(inputDate = new Date()) {
    return `${inputDate.getUTCFullYear()} - ${inputDate.getUTCMonth()}`
}

export function getWeekKey(inputDate = new Date()) {
    // make a copy of date
    const date = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()))

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

export function getCurrentMonthKey(tz = "UTC") {
    return getMonthKey(parseDayKeyToUTCDate(getTodayKeyInTimezone(tz)))
}

export function getCurrentWeekKey(tz = "UTC") {
    return getWeekKey(parseDayKeyToUTCDate(getTodayKeyInTimezone(tz)))
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

export function getDayDiff(day1, day2) {
    const diff = getStartOfDay(day1) - getStartOfDay(day2)
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function toDateStringLocal(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}