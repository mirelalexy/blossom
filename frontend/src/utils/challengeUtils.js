export function getDisplayType(type) {
    if (type === "budget" || type === "mood_all") return "percent"
    return "fraction"
}

export function formatProgress(c) {
    const display = getDisplayType(c.type)

    if (display === "percent") {
        return `${Math.round(c.progress)}%`
    }

    return `${Math.min(c.progress, c.target)}/${c.target}`
}