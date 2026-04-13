export const defaultChallenges = [
    {
        title: "Moody",
        description: "Add a mood for 10 transactions this week.",
        type: "mood_all",
        target: 10,
        period: "weekly"
    },
    {
        title: "On Fire!",
        description: "Log transactions 3 days in a row.",
        type: "streak",
        target: 3,
        period: "weekly"
    },
    {
        title: "Steady Gardener",
        description: "Keep your total spending within your monthly budget.",
        type: "budget",
        target: 100,
        period: "monthly"
    },
    {
        title: "Golden Moments",
        description: "Notice and log 3 happy moments this week.",
        type: "mood",
        mood_type: "happy",
        target: 3,
        period: "weekly"
    },
    {
        title: "Under Control",
        description: "Log 2 calm moments this week.",
        type: "mood",
        mood_type: "calm",
        target: 2,
        period: "weekly"
    },
    {
        id: "through_the_storm",
        title: "Through The Storm",
        description: "Acknowledge 2 anxious moments this week.",
        type: "mood",
        mood_type: "anxious",
        target: 2,
        period: "weekly"
    },
    {
        id: "takes_time_to_blossom",
        title: "Takes Time To Blossom",
        description: "Acknowledge 2 sad moments this week.",
        type: "mood",
        mood_type: "sad",
        target: 2,
        period: "weekly"
    },
    {
        id: "neutral_ground",
        title: "Neutral Ground",
        description: "Log 4 neutral moments this week.",
        type: "mood",
        mood_type: "neutral",
        target: 4,
        period: "weekly"
    },
    {
        id: "money_goes",
        title: "Money Goes",
        description: "Log 10 expense transactions this week.",
        type: "expense_count",
        target: 10,
        period: "weekly"
    },
    {
        id: "counting_money",
        title: "Counting Money",
        description: "Log 5 income transactions this week.",
        type: "income_count",
        target: 5,
        period: "weekly"
    },
    {
        id: "little_steps",
        title: "Little Steps",
        description: "Log 3 expenses under 50 this week.",
        type: "small_expense",
        target: 3,
        period: "weekly"
    },
    {
        id: "big_waves",
        title: "Big Waves",
        description: "Log 2 expenses over 70 this week.",
        type: "big_expense",
        target: 2,
        period: "weekly"
    }
]