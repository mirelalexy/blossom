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

export function parseKey(key) {
    const [y, m] = key.split("-").map(Number)
    return new Date(y, m - 1, 1)
}

export function labelFromKey(key) {
    const date = parseKey(key)
    return date.toLocaleDateString("en-US", { 
        month: "long", 
        year: "numeric" 
    })
}

export function prevMonthKey(key) {
    const d = parseKey(key)
    return toKey(new Date(d.getFullYear(), d.getMonth() - 1, 1))
}

export function nextMonthKey(key) {
    const d = parseKey(key)
    return toKey(new Date(d.getFullYear(), d.getMonth() + 1, 1))
}