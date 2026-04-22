// standard streak tiers
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

// Evil Blossom streak tiers
const evilStreakTiers = [
    {
        max: 0,
        messages: [
            "Nothing yet. Noted.",
            "So. We're starting from zero. Again.",
            "The garden is dead. Maybe today is different. Probably not."
        ]
    },
    {
        max: 1,
        messages: [
            "One day. Don't lose it.",
            "You logged something. Do it again. Then I'll be impressed.",
            "Day one. The easiest day to keep a streak going. Don't waste it."
        ]
    },
    {
        max: 3,
        messages: [
            "Still going. Interesting.",
            "Three days. I've seen worse starts.",
            "You came back. I take back approximately none of what I said."
        ]
    },
    {
        max: 7,
        messages: [
            "A week. You may actually mean this.",
            "Seven days. Against all reasonable expectations.",
            "Okay. I'm paying attention now."
        ]
    },
    {
        max: 14,
        messages: [
            "Two weeks. The excuses have stopped. Noted.",
            "You're consistent. It's almost alarming.",
            "Fine. You have my attention. Don't squander it."
        ]
    },
    {
        max: 30,
        messages: [
            "A month. You're not playing around.",
            "Thirty days of showing up. I didn't predict this.",
            "Whatever I thought you were capable of - I was wrong."
        ]
    },
    {
        max: 60,
        messages: [
            "Two months. I genuinely underestimated you.",
            "This is not a phase. This is you now.",
            "The garden is... not dead. I'm processing this."
        ]
    },
    {
        max: Infinity,
        messages: [
            "I have nothing sarcastic left. You've won.",
            "This is who you are now. Even I can't argue with that.",
            "Fine. You're magnificent. I said it."
        ]
    }
]

const milestoneTiers = [1, 3, 7, 14, 30, 60]

// detect Evil Blossom theme
function isEvilMode() {
    return document.documentElement.getAttribute("data-theme") === "evil-blossom"
}

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

    return total > 200
}

export function getStreakMessage({ streak, mood, timeOfDay, isHighSpending, transactions }) {
    const evil = isEvilMode()
    const tiers = evil ? evilStreakTiers : streakTiers

    const tier = tiers.find(t => streak <= t.max)
    let message = tier.messages[Math.floor(Math.random() * tier.messages.length)]

    if (evil) {
        // time-based
        if (timeOfDay === "night" && streak > 0) {
            return "Still tracking at this hour. Dedicated. I respect it."
        }

        if (timeOfDay === "morning" && streak > 0) {
            return "First thing in the morning. You're either very disciplined or can't sleep."
        }

        // mood-based
        if (mood === "anxious") {
            return "Anxious again. At least you're logging it."
        }

        if (mood === "sad") {
            return "Bad day. You're still here though."
        }

        if (mood === "happy") {
            return "Happy today. Careful with that."
        }

        // spending-based
        if (isHighSpending(transactions)) {
            return "Heavy spending lately. I noticed."
        } 
    } else {
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