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

export function getNextMonthInfo() {
    const today = new Date()
    const currentMonth = today.getMonth()

    const nextMonth = (currentMonth + 1) % 12
    const year = today.getFullYear()

    let targetDate = new Date(year, nextMonth, 1)

    if (today > targetDate) {
        targetDate = new Date(year + 1, nextMonth, 1)
    }

    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const monthName = months[nextMonth]

    if (diffDays === 0) {
        return `${monthName} is today!`
    }
    
    if (diffDays === 1) {
        return `${monthName} is tomorrow.`
    }

    return `${monthName}'s only ${diffDays} days away.`
}

export function getTimeOfDay() {
    const hour = new Date().getHours()

    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"

    return "evening"
}

export function getGreeting() {
    const time = getTimeOfDay()

    if (time === "morning") return "Good morning"
    if (time === "afternoon") return "Good afternoon"

    return "Good evening"
}

export function getCurrentMonthYear() {
    const today = new Date()

    return today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    })
}