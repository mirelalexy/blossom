import { formatCurrency } from "./currencyUtils"
import { getTimeOfDay } from "./dateUtils"

export function isEvilMode() {
    return document.documentElement.getAttribute("data-theme") === "evil-blossom"
}

export function getEvilBudgetMessage({ pct, remaining, currency }) {
    if (pct === 0) return "Nothing spent yet. The month is full of potential."
    else if (pct < 50) return `${Math.round(pct)}% used. Still early. Don't get comfortable.`
    else if (pct < 80) return `${Math.round(pct)}% gone. Halfway through the budget, roughly.`
    else if (pct < 100) return `${Math.round(pct)}% used. You can see the edge from here.`
    else return `Over by ${formatCurrency(remaining, currency)}. It happened.`
}

export function getEvilGreeting(name) {
    const time = getTimeOfDay()

    if (time === "morning") return `Up early, ${name}...`
    if (time === "afternoon") return `${name}.`
    if (time === "evening") return `Evening, ${name}.`
    return `Still awake, ${name}?`
}

export const evilStreakTiers = [
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

export const evilOnboarding = {
    steps: {
        0: "So you've decided to try this.",
        1: "Good start. Two more things and you're set.",
        2: "Almost there. One more.",
        3: "Ready. This is where it begins. Or doesn't."
    },
    featureCards: [
        {
            icon: "transactions",
            title: "Log with honesty",
            body: "Every transaction you log tells me something. I track what you spend, how you felt, and why. The picture I build is only as good as what you give me. Don't lie to me."
        },
        {
            icon: "goals",
            title: "Save for something real",
            body: "Set a primary goal. I'll keep it visible. Whether you actually work toward it is up to you."
        },
        {
            icon: "profile",
            title: "Earn your way up",
            body: "Every transaction earns XP. Streaks and challenges add more. Levels are a way of tracking how long you've been honest with yourself."
        },
        {
            icon: "heart",
            title: "Your Journey page",
            body: "Once you've logged enough, I'll show you what I've noticed. Mood vs spending. Impulse vs planned. It won't always be flattering. That's the point."
        },
        {
            icon: "gem",
            title: "Earn your rewards",
            body: "Set a task. Complete it. Then claim what you promised yourself - guilt-free, because you actually earned it."
        }
    ]
}