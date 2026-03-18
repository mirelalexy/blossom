const streakTiers = [
    {   
        max: 0,
        messages: [
            "Let's start something beautiful today.",
            "A fresh start... I'm right here with you.",
            "Today could be the beginning of something really good."
        ]
    },
    {   
        max: 1,
        messages: [
            "Day one... the hardest part is already done.",
            "You showed up today. That matters more than you think.",
            "One step in... and you're already doing better."
        ]
    },
    {   
        max: 3,
        messages: [
            "You showed up again... that matters more than you think.",
            "Tiny steps still count.",
            "Consistency looks good on you."
        ]
    },
    {   
        max: 7,
        messages: [
            "Look at you go! Little steps, real change.",
            "You're building something steady...",
            "This is how habits start forming..."
        ]
    },
    {   
        max: 14,
        messages: [
            "You're creating a rhythm...",
            "This is real consistency now. I hope you feel it too.",
            "You've been showing up for yourself."
        ]
    },
    {   
        max: 30,
        messages: [
            "This is becoming a habit now. I'm proud of you!",
            "You didn't just start... you stayed.",
            "There's something really steady about you now..."
        ]
    },
    {   
        max: 60,
        messages: [
            "Your consistency is blooming into something powerful.",
            "This kind of discipline changes things...",
            "You've built something most people struggle to start."
        ]
    },
    {   
        max: Infinity,
        messages: [
            "This isn't luck anymore... this is who you are.",
            "You've grown into this version of yourself... and it shows.",
            "At this point? This is part of you now. And it's beautiful."
        ]
    },
]

const milestoneTiers = [1, 3, 7, 14, 30, 60]

export function getRecentMood(transactions) {
    const recent = transactions
        .filter(t => t.mood)
        .slice(-3)

    if (!recent.length) return null

    return recent[recent.length - 1].mood
}

export function isHighSpending(transactions) {
    // get last 3 transactions
    const recent = transactions.slice(-3)

    const total = recent.reduce((sum, t) => sum + t.amount, 0)

    // TODO: adjust later
    return total > 200
}

export function getStreakMessage({ streak, mood, timeOfDay, transactions }) {
    const tier = streakTiers.find(t => streak <= t.max)
    let message = tier.messages[Math.floor(Math.random() * tier.messages.length)]

    // time-based
    if (timeOfDay === "night" && streak > 0) {
        return "Late night check-in... I like your dedication."
    }

    if (timeOfDay === "morning" && streak > 0) {
        return "Starting your day like this? I love that for you!"
    }

    // mood-based
    if (mood === "anxious") {
        return "Hey... you're still showing up, even on tough days."
    }

    if (mood === "sad") {
        return "I'm really glad you came back today!"
    }

    if (mood === "happy") {
        return "You're glowing today... Let's keep that energy!"
    }

    // spending-based
    if (isHighSpending(transactions)) {
        return "You've been spending a bit more lately... but you're aware now."
    }

    return message
}

export function getNextMilestone(streak) {
    for (let m of milestoneTiers) {
        if (streak < m) return m
    }

    // after 100 days, new milestone is every 25 days
    return Math.ceil((streak + 1) / 25) * 25
}


export function calculateStreak(transactions) {
    if (!transactions.length) return 0

    // sort by date desc
    const sorted = [...transactions]
        .filter(t => t.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    let streak = 0
    let currentDate = new Date()

    // normalize today (set to midnight)
    currentDate.setHours(0, 0, 0, 0)

    // count unique days
    const uniqueDays = [
        ...new Set(sorted.map(t => t.date))
    ]

    for (let i = 0; i < uniqueDays.length; i++) {
        const transactionDate = new Date(uniqueDays[i])

        // normalize transaction date
        transactionDate.setHours(0, 0, 0, 0)

        const diffDays = Math.floor((currentDate - transactionDate) / (1000 * 60 * 60 * 24))

        if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = transactionDate
        } else {
            break
        }
    }

    return streak
}