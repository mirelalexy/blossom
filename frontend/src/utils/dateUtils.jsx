export function formatDate(dateString) {
    const date = new Date(dateString)
    const today = new Date()

    const diffDays = Math.floor(
        (today - date) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    })
}