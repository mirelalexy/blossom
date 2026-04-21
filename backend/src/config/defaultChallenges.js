export const defaultChallenges = [
    // -- MOOD (6) -------------------------------------
    {
        title: "Moody",
        description: "Tag your mood on 10 transactions this week. The picture gets clearer the more honest you are.",
        type: "mood",
        target: 10,
        period: "weekly"
    },
    {
        title: "Golden Moments",
        description: "Log 3 happy-mood transactions this week. Notice what made you feel good.",
        type: "mood",
        mood_type: "happy",
        target: 3,
        period: "weekly"
    },
    {
        title: "Under Control",
        description: "Log 2 calm-mood transactions this week. Calm spending is usually the most intentional.",
        type: "mood",
        mood_type: "calm",
        target: 2,
        period: "weekly"
    },
    {
        title: "Through The Storm",
        description: "Acknowledge 2 anxious moments this week. You don't have to fix them, just stay observant.",
        type: "mood",
        mood_type: "anxious",
        target: 2,
        period: "weekly"
    },
    {
        title: "Takes Time To Blossom",
        description: "Acknowledge 2 sad moments this week. Logging on hard days is harder, but more valuable.",
        type: "mood",
        mood_type: "sad",
        target: 2,
        period: "weekly"
    },
    {
        title: "Neutral Ground",
        description: "Log 4 neutral-mood transactions this week. Routine spending deserves attention too.",
        type: "mood",
        mood_type: "neutral",
        target: 4,
        period: "weekly"
    },

    // -- STREAK (2) -------------------------------------
    {
        title: "On Fire!",
        description: "Log transactions 3 days in a row. Showing up consistently is the whole point.",
        type: "streak",
        target: 3,
        period: "weekly"
    },
    {
        title: "Committed",
        description: "Keep your streak alive for 7 days. A week of showing up is already something real.",
        type: "streak",
        target: 7,
        period: "monthly"
    },

    // -- BUDGET (1) -------------------------------------
    {
        title: "Steady Gardener",
        description: "Stay within your monthly budget. Progress shows how much of the month remains safely under limit.",
        type: "budget",
        target: 100,
        period: "monthly"
    },

    // -- TRANSACTION COUNT (3) -------------------------------------
    {
        title: "Money Goes",
        description: "Log 10 expense transactions this week. Visibility is the first step.",
        type: "expense_count",
        target: 10,
        period: "weekly"
    },
    {
        title: "Counting Money",
        description: "Log 5 income transactions this week. Income matters as much as expenses.",
        type: "income_count",
        target: 5,
        period: "weekly"
    },
    {
        title: "Big Picture",
        description: "Log 30 expense transactions this month. At 30 entries, patterns start becoming visible.",
        type: "expense_count",
        target: 30,
        period: "monthly"
    },

    // -- TRANSACTION AMOUNT (2) -------------------------------------
    {
        title: "Little Steps",
        description: "Log 3 expenses under 50 this week. Remember small purchases add up.",
        type: "small_expense",
        target: 3,
        period: "weekly"
    },
    {
        title: "Big Waves",
        description: "Log 2 expenses over 70 this week. Large purchases deserve to be seen and named.",
        type: "big_expense",
        target: 2,
        period: "weekly"
    },

    // -- INTENT (3) -------------------------------------
    {
        title: "Planner",
        description: "Log 5 planned expenses this week. Planned spending is deliberate spending.",
        type: "intent",
        intent_type: "planned",
        target: 5,
        period: "weekly"
    },
    {
        title: "Essentials First",
        description: "Log 3 necessary expenses this week. Knowing what you genuinely need is useful on its own.",
        type: "intent",
        intent_type: "necessary",
        target: 3,
        period: "weekly"
    },
    {
        title: "Ah... Impulse Again",
        description: "Log 2 impulse purchases this week. Be honest. Naming them is the first step to understanding them.",
        type: "intent",
        intent_type: "impulse",
        target: 2,
        period: "weekly"
    },

    // -- CASH VS CARD (2) -------------------------------------
    {
        title: "Go Cash",
        description: "Log 3 cash transactions this week. Cash tends to feel more real - try it intentionally.",
        type: "method",
        method_type: "cash",
        target: 3,
        period: "weekly"
    },
    {
        title: "Card Tracker",
        description: "Log 5 card transactions this week with a mood and intent. Card spending is easy to lose track of, so make sure to tag it all.",
        type: "method_tagged",
        method_type: "card",
        target: 5,
        period: "weekly"
    },

    // -- GOALS (1) -------------------------------------
    {
        title: "Growing",
        description: "Add to your primary saving goal this month. Even a small deposit keeps the momentum alive.",
        type: "goal_deposit",
        target: 1,
        period: "monthly"
    }
]