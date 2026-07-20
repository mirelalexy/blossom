import pool from "../db.js"

const DEFAULT_RANGE = 60
const MAX_TRANSACTIONS = 100

const MONTHS = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
]

function extractDateRange(question) {
    const lower = question.toLowerCase()
    const now = new Date()

    // look for keywords to determine range
    if (lower.includes("last month")) {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth(), 0)
        return { start, end }
    }

    if (lower.includes("this month")) {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        return { start, end: now }
    }

    if (lower.includes("last week")) {
        const day = now.getDay()

        // convert Sunday (= 0, 6 days since Monday)
        const daysSinceMonday = day === 0 ? 6 : day - 1

        const end = new Date(now)

        // get last Sunday
        end.setDate(end.getDate() - daysSinceMonday - 1)

        const start = new Date(end)

        // get last Monday
        start.setDate(start.getDate() - 6)

        return { start, end }
    }

    if (lower.includes("this week")) {
        const start = new Date(now)
        const day = start.getDay()

        const daysSinceMonday = day === 0 ? 6 : day - 1

        start.setDate(start.getDate() - daysSinceMonday)

        return { start, end: now }
    }

    if (lower.includes("today")) {
        return { start: new Date(now), end: new Date(now) }
    }

    if (lower.includes("yesterday")) {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return { start: yesterday, end: yesterday }
    }

    if (lower.includes("last year")) {
        const year = now.getFullYear() - 1

        const start = new Date(year, 0, 1)
        const end = new Date(year, 11, 31)

        return { start, end }
    }

    if (lower.includes("this year")) {
        const start = new Date(now.getFullYear(), 0, 1)
        return { start, end: now }
    }

    // look for month names
    for (let i = 0; i < MONTHS; i++) {
        if (lower.includes(MONTHS[i])) {
            // assume most recent occurrence of the month
            let year = now.getFullYear()

            // month has not been met yet this year
            if (i > now.getMonth) {
                year -= 1
            }

            const start = new Date(year, i, 1)
            const end = new Date(year, i + 1, 0)

            return { start, end }
        }
    }

    // use default range if no keywords detected
    const start = new Date(now)
    start.setDate(start.getDate() - DEFAULT_RANGE)
    return { start, end: now }
}

function summarizeByField(transactions, field) {
    const counts = {}
    let total = 0

    for (const t of transactions) {
        const key = t[field] || "untagged"
        const amount = Number(t.amount) || 0
        
        // initialize if key does not exist
        counts[key] = counts[key] || { count: 0, amount: 0 }

        counts[key].count += 1
        counts[key].amount += amount
        total += amount
    }

    const summary = {}

    for (const key in counts) {
        summary[key] = {
            count: counts[key].count,
            // get percentage of entries
            pctEntries: transactions.length
                ? Math.round((counts[key].count / transactions.length) * 100)
                : 0,
            // get percentage of sum spent
            pctSpending: total
                ? Math.round((counts[key].amount / total) * 100)
                : 0,
        }
    }

    return summary
}