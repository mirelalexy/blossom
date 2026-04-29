import { isEvilMode } from "../utils/evilBlossom"

export const EMPTY = {
    // transactions
    transactions: {
        title: "Nothing here yet",
        subtitle: "Every transaction you log becomes something I can learn from. Start whenever you're ready."
    },
    transactionsFiltered: {
        title: "No matches",
        subtitle: "Nothing fits those filters. Try adjusting them or clearing all."
    },
    transactionsSearch: (query) => ({
        title: `Nothing for "${query}"`,
        subtitle: "Try a different word or check the spelling."
    }),
    transactionsRecent: {
        title: "Nothing logged recently",
        subtitle: "Nothing logged in the last 7 days. Whenever you're ready, I'm here."
    },
    transactionsUpcoming: {
        title: "Nothing scheduled",
        subtitle: "Recurring transactions due this month will appear here."
    },

    // goals
    goals: {
        title: "What are you saving for?",
        subtitle: "A goal gives your spending a direction. Even a small one makes the day-to-day feel different."
    },
    goalsSearch: {
        title: "Nothing matches",
        subtitle: "No goals found for that search."
    },

    // challenges
    challenges: {
        title: "No challenges here",
        subtitle: "Switch to a different filter to see more."
    },

    // notifications
    notifications: {
        title: "All quiet here",
        subtitle: "Level-ups, challenge completions, budget warnings, and goal reminders will appear here."
    },

    // rewards
    rewards: {
        title: "No rewards yet",
        subtitle: "Add something meaningful to work toward. You deserve it."
    },
    tasks: {
        title: "No tasks yet",
        subtitle: "Add a task to gate a reward, complete it to unlock your treat."
    },

    // journey
    journeyEmpty: {
        title: "Nothing logged this month",
        subtitle: "Switch to a month with transactions to see your insights."
    },
    journeyPatterns: {
        title: "Not enough data yet",
        subtitle: "Log a few more transactions and I'll start noticing patterns."
    },

    // rules
    rules: {
        title: "No spending rules yet",
        subtitle: "Rules help you set soft limits on categories. They warn - they never block."
    }
}

const EVIL_EMPTY = {
    transactions: {
        title: "Nothing logged.",
        subtitle: "I can't learn anything from an empty slate. Start whenever you're ready. Or don't."
    },
    transactionsFiltered: {
        title: "No matches.",
        subtitle: "Nothing fits those filters. Adjust them."
    },
    transactionsSearch: (query) => ({
        title: `Nothing for "${query}".`,
        subtitle: "Try something else."
    }),
    transactionsRecent: {
        title: "Nothing in 7 days.",
        subtitle: "I noticed. Whenever you're ready."
    },
    transactionsUpcoming: {
        title: "Nothing scheduled.",
        subtitle: "No upcoming recurring transactions this month."
    },
    goals: {
        title: "No goals.",
        subtitle: "What are you actually saving for? Name it. I'll keep watch."
    },
    goalsSearch: {
        title: "Nothing matches.",
        subtitle: "No goals found."
    },
    challenges: {
        title: "None here.",
        subtitle: "Try a different filter."
    },
    notifications: {
        title: "Nothing yet.",
        subtitle: "Level-ups, challenge completions, budget warnings, and goal reminders will appear here when they happen."
    },
    rewards: {
        title: "No rewards set.",
        subtitle: "Add something to work toward. You're allowed to want things."
    },
    tasks: {
        title: "No tasks.",
        subtitle: "Add something to accomplish first. Then earn it."
    },
    journeyEmpty: {
        title: "Nothing logged this month.",
        subtitle: "Switch to a month with data."
    },
    journeyPatterns: {
        title: "Not enough data.",
        subtitle: "Log more transactions and I'll start noticing things."
    },
    rules: {
        title: "No rules yet.",
        subtitle: "Rules set soft limits on categories. They flag things before you log. Never after."
    }
}

export function getEmpty(key, ...args) {
    const source = isEvilMode() ? EVIL_EMPTY : EMPTY
    const value  = source[key]
    if (typeof value === "function") return value(...args)
    return value || EMPTY[key] || { title: "Nothing here", subtitle: "" }
}
