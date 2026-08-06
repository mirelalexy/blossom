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
        category: "Logging Habits",
        title: "Log it, especially when you don't want to",
        content: "The purchase you're pretending didn't happen is usually the most interesting one. If you skip it, you're not hiding it from me. You're hiding it from yourself."
    },
    {
        category: "Logging Habits",
        title: "Small purchases built this habit",
        content: "Do you ever wonder about the coffees, snacks, and subscriptions that were just a few bucks? How do they even add up? Well, guess what? You need to log them all. Don't skip because it makes you uncomfortable. Live with that feeling. You spent that money, might as well admit it to yourself."
    },
    {
        category: "Logging Habits",
        title: "Stop trying to pick the perfect mood",
        content: "This isn't a psychology exam. Pick the closest one and move on. Your patterns care about consistency far more than precision."
    },
     {
        category: "Logging Habits",
        title: "Budgets don't fail, but people stop looking at them",
        content: "Going over budget isn't the problem. Pretending it didn't happen is. If your budget no longer matches reality, change it. Reality won't change itself."
    },
    {
        category: "Goals & Rewards",
        title: "If your goal doesn't demand choices, it's not a goal",
        content: "Saving for something should occasionally make spending on something else uncomfortable. Otherwise you're just waiting, not choosing."
    },
    {
        category: "Goals & Rewards",
        title: "Earn the reward properly",
        content: "Don't invent fake victories so you can collect fake rewards. Make the task difficult enough that claiming the reward actually feels deserved."
    },
    {
        category: "Streaks & Check-ins",
        title: "Don't confuse a streak with progress",
        content: "A long streak doesn't automatically mean you've learned anything. It's proof you showed up. What you do with that consistency is the part that actually matters."
    },
    {
        category: "Streaks & Check-ins",
        title: "Quiet days still count",
        content: "Nothing happened financially? Good. Check in anyway. Your brain existed today even if your wallet didn't."
    },
    {
        category: "Reflection",
        title: "Leave breadcrumbs for your future self",
        content: "You'll swear you'll remember why you bought that weird thing. You won't. Write the note while you still know."
    },
    {
        category: "Reflection",
        title: "The month is smarter than the moment",
        content: "Three days tell stories. Thirty days tell the truth. Wait until the month ends before deciding who you think you are."
    },
    {
        category: "Reflection",
        title: "Don't defend your habits",
        content: "Every habit makes perfect sense to the person doing it. That's exactly why you should question it before you justify it."
    },
     {
        category: "Conversation",
        title: "Ask something that makes you uncomfortable",
        content: "Don't waste me on questions you already know the answer to. Ask what you're avoiding. Ask what pattern you're pretending not to see. Then let's ruin your excuses together."
    },
    {
        category: "Conversation",
        title: "Context helps me call you out accurately",
        content: "A short bio gives me context your transactions can't. It's optional. But if I'm going to challenge your thinking, I'd rather know who I'm talking to."
    }
]

export const EVIL_FAQ = [
    {
        category: "Getting Started",
        title: "What actually are you?",
        content: "I'm a budget tracker built around the idea that money is emotional. Most apps tell you what you spent. I care more about why. Every transaction gives me another piece of the picture: what you bought, how you felt, why you justified it, and what habits start repeating. I won't connect to your bank or tell you what to do with your money. I'll simply show you what's already there. Whether you look is your problem."
    },
    {
        category: "Getting Started",
        title: "Do you connect to my bank?",
        content: "No. Everything is logged manually. That little bit of effort is intentional. Automatic imports record transactions. Manually writing them down forces you to acknowledge them. Turns out awareness requires participation."
    },
    {
        category: "Spending & Insights",
        title: "What do the mood tags actually do?",
        content: "Every transaction can be tagged with the mood you were in when you made it. I keep those tags because feelings have an annoying habit of repeating themselves. Journey will eventually show you which emotions tend to cost you money. Sometimes the patterns are surprisingly obvious. Sometimes they're just uncomfortable."
    },
    {
        category: "Spending & Insights",
        title: "What's purchase intent?",
        content: "Every expense can be marked as necessary, planned, or impulse. It's less about judging your choices and more about exposing how often you convince yourself something just... happened. Once enough data builds up, excuses become much harder to maintain."
    },
    {
        category: "Spending & Insights",
        title: "Why do I log whether I paid by card or cash?",
        content: "Because paying doesn't always feel the same. Cash leaves your hand. Cards barely interrupt your day. I compare both so you can see whether convenience quietly changes your behavior. Neither method is automatically better. One might simply be better at helping you forget you spent money."
    },
    {
        category: "Spending & Insights",
        title: "What is my Journey?",
        content: "Journey is where I stop collecting information and start connecting it. Spending, moods, purchase intent, payment methods, income, expenses, growth stages... it's all there. The longer you stay with me, the harder it becomes to pretend your habits came out of nowhere."
    },
    {
        category: "Streaks, XP & Challenges",
        title: "How does XP and levelling up work?",
        content: "Transactions earn 5 XP. Check-ins earn 3 XP. Every day your streak survives adds another 2 XP. Challenges are worth 30 XP. More XP means higher levels and new titles, from Mindful Seed to Eternal Bloom. The levels get harder because progress should eventually require consistency, not enthusiasm."
    },
    {
        category: "Streaks, XP & Challenges",
        title: "What is a streak?",
        content: "A streak counts consecutive days where you either logged a transaction or completed a check-in. Miss a day and it resets. It's not measuring perfection. It's measuring whether you kept showing up after life inevitably became inconvenient."
    },
    {
        category: "Streaks, XP & Challenges",
        title: "What's a check-in?",
        content: "A check-in lets you record how you're feeling without spending anything. I built it because a streak that only rewarded purchases would have been a spectacularly stupid idea. Some of your healthiest financial days won't involve money moving at all."
    },
    {
        category: "Streaks, XP & Challenges",
        title: "What are challenges?",
        content: "Challenges are weekly and monthly objectives I generate automatically. Log consistently. Stay within budget. Remember your mood tags. Complete them and you'll earn XP. Think of them as gentle nudges before your habits become permanent."
    },
    {
        category: "Rewards & Goals",
        title: "How do Rewards and Tasks work?",
        content: "Link a real task to a reward worth earning. Finish the task and the reward unlocks. If it costs money, I'll log the expense automatically. If it doesn't, even better. Just don't cheat the system. You're only making it easier to fool yourself."
    },
    {
        category: "Conversation",
        title: "Can I ask you things directly?",
        content: "Of course. Find me on your Home page. Ask about your spending, your moods, your habits, or whatever question you've been carefully avoiding. I'll answer using your data and what I know about human behavior."
    },
    {
        category: "Conversation",
        title: "Can I tell you more about myself?",
        content: "If you write a bio in Settings → Data & Privacy → Your Bio, I'll use it as context. Your work, goals, ambitions, whatever matters. It's optional. I won't quote it back to you. Just connecting stuff..."
    },
    {
        category: "Account & Customization",
        title: "Can I pick my own category icons?",
        content: "Yes. Create or edit a category and pick whichever icon makes sense to you. If you realize halfway through logging a transaction that you're missing a category, create it on the spot."
    },
    {
        category: "Account & Customization",
        title: "What if I forget my password?",
        content: "Click \"Forgot password?\" on the login page and I'll email you a reset link that expires after an hour. If your password ever changes (whether through recovery or Settings), I'll send another email. If someone else changed it, I'd rather you found out immediately."
    },
    {
        category: "Account & Customization",
        title: "Why do I need to verify my email?",
        content: "Because your recovery options depend on that email actually belonging to you. I'll send a verification link after registration. Click it, then log in. Lose the email? Request another. Bureaucracy is annoying. Losing your account is worse."
    },
    {
        category: "Account & Customization",
        title: "Can I change my email address?",
        content: "Settings → Account → Email. Enter your current password first. I'll send a confirmation link to the new address, and nothing changes until you click it. Ignore it, and your old email stays exactly where it is. Once the change goes through, I'll notify your previous email too. Just in case."
    },
    {
        category: "Account & Customization",
        title: "Can I export my data?",
        content: "Yes. Settings → Data & Privacy → Export Data. You'll get a CSV containing your transaction history, ready for whatever spreadsheet obsession you have planned."
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