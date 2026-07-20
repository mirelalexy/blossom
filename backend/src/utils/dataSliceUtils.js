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

function computeStats(transactions) {
    // keep only expenses
    const expenses = transactions.filter((t => t.type === "expense"))

    // get basic statistics
    const totalSpent = expenses.reduce((sum, t) => sum + Number(t.amount), 0)
    const avgPurchase = expenses.length ? totalSpent / expenses.length : 0

    const largestPurchase = expenses.reduce(
        (max, t) => Number(t.amount) > Number(max?.amount || 0) ? t : max,
        null
    )

    // get category statistics
    const categoryCounts = {}

    for (const t of expenses) {
        const name = t.category_name || "Uncategorized"
        categoryCounts[name] = (categoryCounts[name] || 0) + 1
    }

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]

    // get mood statistics
    const moodCounts = {}

    for (const t of transactions) {
        const mood = t.mood || "Untagged"
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
    }

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

    // get intent statistics
    const intentCounts = {}

    for (const t of transactions) {
        const intent = t.intent || "Untagged"
        intentCounts[intent] = (intentCounts[intent] || 0) + 1
    }

    const topIntent = Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0]

    return {
        totalSpent: Number(totalSpent.toFixed(2)),
        averagePurchase: Number(avgPurchase.toFixed(2)),
        largestPurchase: largestPurchase 
            ? { amount: Number(largestPurchase.amount), title: largestPurchase.title } 
            : null,
        topCategory: topCategory
            ? { name: topCategory[0], count: topCategory[1] }
            : null,
        topMood: topMood
            ? { mood: topMood[0], count: topMood[1] }
            : null,
        topIntent: topIntent
            ? { intent: topIntent[0], count: topIntent[1] }
            : null 
    }
}

export async function getDataSlice(userId, question) {
    const { start, end } = extractDateRange(question)

    // get transactions in range and category name to use directly
    const result = await pool.query(
        `SELECT
            t.id, t.amount, t.type, t.method, t.title,
            c.name AS category_name,
            t.date::text AS date, t.mood, t.intent, t.notes
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.user_id = $1 AND t.date >= $2 AND t.date <= $3
        ORDER BY t.date DESC
        LIMIT $4`,
        [userId, start.toISOString().slice(0, 10), end.toISOString().slice(0, 10), MAX_TRANSACTIONS]
    )

    const transactions = result.rows

    return {
        dateRange: {
            start: start.toISOString().slice(0, 10),
            end: end.toISOString().slice(0, 10)
        },
        transactionCount: transactions.length,
        transactions,
        moodSummary: summarizeByField(transactions, "mood"),
        intentSummary: summarizeByField(transactions, "intent"),
        stats: computeStats(transactions)
    }
}