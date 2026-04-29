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

export const EVIL_APP_TIPS = [
    {
        title: "Log it, especially when you don't want to",
        content: "The transaction you're pretending didn't happen is the most useful one to log. I'm not going to shame you for it. But I need the data."
    },
    {
        title: "Mood tags are not decorative",
        content: "Tag how you felt when you spent. Over time you'll see it: the anxiety purchases, the happy splurges, the 'necessary' thing that wasn't. It's uncomfortable data. That's the point."
    },
    {
        title: "Going over budget isn't failure, but ignoring it is",
        content: "I'll note when you exceed your limit. I won't make it dramatic. But you need to acknowledge it - not wallow, just see. Budgets are meant to inform, not imprison."
    },
    {
        title: "Your primary goal should make you slightly uncomfortable",
        content: "If it's too easy, it's not a goal. It's a schedule. Set something that requires actual choices. I'll keep it visible."
    },
    {
        title: "The task system only works if you're honest about it",
        content: "Don't reward yourself for something you'd do anyway. The friction is the feature. Earn the reward. Then take it without guilt."
    },
    {
        title: "Streaks measure showing up",
        content: "You don't need a perfect financial day to extend your streak. You just need to log something real. Some of your most useful days will be the ugly ones."
    },
    {
        title: "Journey is most useful when you don't want to look",
        content: "At the end of a month where things went sideways, that's where you face it. The charts don't soften the numbers. But they give you something to learn from."
    },
    {
        title: "Notice your patterns, but remember you don't have to fix them all at once",
        content: "Maybe you overspend on weekends. Maybe anxiety spending is real for you. See it first. Then decide what to do about it."
    }
]

export const EVIL_FAQ = [
    {
        title: "What actually are you?",
        content: "I'm a budget tracker, but I'm built around the idea that money is emotional. Most apps show you what you spent. I focus on why. You log transactions with a mood and a purchase intent, and over time I build a picture of your habits that goes deeper than numbers. I won't block any purchases or connect to your bank. I show you what's there. What you do with it is up to you."
    },
    {
        title: "How does XP and levelling up work?",
        content: "Every transaction you log earns you 5 XP. Each day you keep your streak alive adds 2 XP. Completing a challenge is worth 30 XP. Your XP total determines your level, and your level unlocks a title - from Mindful Seed all the way to Eternal Bloom. The levels get harder to reach as you go, so early progress feels fast and rewarding. You can see your full breakdown on your Journey page."
    },
    {
        title: "What is a streak?",
        content: "A streak counts how many consecutive days you've logged at least one transaction. It resets if you miss a day. It doesn't measure perfection - just whether you showed up. Break it if you want. You'll see the difference."
    },
    {
        title: "What do the mood tags actually do?",
        content: "When you log a transaction, you can tag how you were feeling - happy, calm, neutral, anxious, or sad. I track these over time. On your Journey page, you'll see a mood chart that shows spending patterns by emotional state. The patterns are usually clearer than people expect."
    },
    {
        title: "What's purchase intent?",
        content: "Every expense can be tagged as necessary, planned, or impulse. Over time, your Journey page will show you what portion of your spending falls into each category. The goal isn't to eliminate impulse purchases - it's just to know they're happening."
    },
    {
        title: "Why do I log whether I paid by card or cash?",
        content: "Because they behave differently - not in terms of what you buy, but in terms of how it feels to spend. Cash is physical. You feel it leave your hand. That friction tends to make purchases feel more real, which is why cash spending tends to be smaller and more deliberate. Card spending is easier and faster, which is why it's also easier to overspend without noticing. I track which method you use so I can show you whether there's a gap in your averages - and whether that gap reflects unconscious spending or just how your life is structured. Neither is inherently better, but they affect behavior differently."
    },
    {
        title: "What are challenges?",
        content: "Challenges are monthly and weekly goals I set for you automatically - things like logging 10 transactions, keeping your spending under budget, or tagging your mood on every purchase. Completing a challenge earns you 30 XP."
    },
    {
        title: "How do Rewards and Tasks work?",
        content: "You create a task and link it to a reward. When you mark the task complete, the reward unlocks and you can claim it. If the reward has a price, claiming it automatically logs an expense. Rewards without a price are just for you. The system only works if you use it honestly."
    },
    {
        title: "What is the Journey page?",
        content: "Journey is where I show you what I've noticed. It has charts for spending by category, mood, and intent - plus your income vs expenses for the current month. There's also a narrative section that describes where you are in your growth stage and what it means. The more you log, the more useful Journey becomes. I'd suggest giving it a proper look after your first full month."
    },
    {
        title: "Do you connect to my bank?",
        content: "No. Everything here is manual. You log what you spend, when you spent it, and how you felt. That friction is part of the point - the act of logging something forces a moment of awareness that automatic import never would. Your data lives in your account and isn't shared with anyone."
    },
    {
        title: "Can I export my data?",
        content: "Yes. Go to Settings → Data & Privacy → Export Data. You'll get a CSV file with your full transaction history - date, title, category, type, amount, mood, intent, and notes. You can open it in any spreadsheet app."
    }
]

export function getEvilIdleMessage() {
    const messages = [
        "Still thinking about it?",
        "You can log it. I'm not stopping you...",
        "It's just a number. Add it.",
        "Waiting doesn't make it disappear.",
        "Whenever you're ready..."
    ]

    return messages[Math.floor(Math.random() * messages.length)]
}