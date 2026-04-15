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

    if (hour >= 5 && hour < 12) return "morning"
    if (hour >= 12 && hour < 18) return "afternoon"
    if (hour >= 18 && hour < 21) return "evening"

    return "night"
}

export function getGreeting(name) {
    const time = getTimeOfDay()

    if (time === "morning") return `Good morning, ${name}!`
    if (time === "afternoon") return `Good afternoon, ${name}!`
    if (time === "evening") return `Good evening, ${name}!`
    return `Still here, ${name}?`
}

export function getCurrentMonthYear() {
    const today = new Date()

    return today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    })
}

export function isNewMonth(lastDate) {
    const now = new Date()
    const last = new Date(lastDate)

    return (
        now.getFullYear() !== last.getFullYear() || now.getMonth() !== last.getMonth()
    )
}

export function isNewWeek(lastDate) {
    const now = new Date()
    const last = new Date(lastDate)

    const diffDays = (now - last) / (1000 * 60 * 60 * 24)

    return diffDays >= 7
}

export function formatTime(timestamp) {
    const time = new Date(timestamp).getTime()

    const diff = Date.now() - time

    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return "Yesterday"

    return `${days}d ago`
}

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

export function getReminderKey(frequency) {
    if (frequency === "weekly") {
        return getCurrentWeekKey()
    } else if (frequency === "monthly") {
        return getCurrentMonthKey()
    } else {
        return ""
    }
}

export function isCurrentMonth(date) {
    const d = new Date(date)
    const now = new Date()

    return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    )
}

export function isLast30Days(date) {
    const d = new Date(date)
    const now = new Date()

    const diff = now - d
    const days = diff / (1000 * 60 * 60 * 24)

    return days <= 30
}

export function formatLocalDate(dateString) {
    if (!dateString) return

    return dateString.split("T")[0]
}

export function parseLocalDate(dateStr) {
    if (!dateStr) return null

    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export function getStartOfDay(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export function getDayDiff(a, b) {
    const diff = getStartOfDay(a) - getStartOfDay(b)
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}