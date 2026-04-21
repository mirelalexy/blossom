import { parseLocalDate } from "./dateUtils"

export function toKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function isInMonth(dateStr, monthKey) {
    if (!dateStr) return false

    const d = parseLocalDate(dateStr)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return key === monthKey
}