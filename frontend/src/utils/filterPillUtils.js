function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatCategoryLabel(categoryId, categories) {
    if (!categoryId) return null
    return categories.find(c => c.id === categoryId)?.name || null
}

export function formatTypeLabel(type) {
    if (!type) return null
    return capitalize(type)
}

export function formatIntentLabel(intent) {
    if (!intent) return null
    return capitalize(intent)
}

export function formatMoodLabel(mood) {
    if (!mood) return null
    return capitalize(mood)
}

export function formatDateRangeLabel(period) {
    if (!period?.start && !period?.end) return null

    const short = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }

    if (period.start && period.end) return `${short(period.start)} - ${short(period.end)}`
    if (period.start) return `From ${short(period.start)}`
    return `Until ${short(period.end)}`
}

export function formatRuleTypeLabel(type) {
    if (!type) return null
    return type === "single_limit" ? "Single Transaction Limit" : "Weekly Transaction Limit"
}