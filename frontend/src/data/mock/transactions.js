export const transactions = [
    {
        id: 1,
        category: "Food",
        merchant: "Lidl",
        amount: 130,
        currency: "RON",
        type: "Expense",
        mood: "calm",
        date: "2026-03-03",
        method: "Cash",
        notes: "I was really craving sushi and I finally found some in stock!",
        createdAt: "2026-03-03T14:20:02Z"
    },
    {
        id: 2,
        category: "Coffee",
        merchant: "Tucano Coffee",
        amount: 25,
        currency: "RON",
        type: "Expense",
        mood: "anxious",
        date: "2026-03-02",
        method: "Card",
        notes: "I have an exam today so I thought I could get coffee and study, but I couldn't focus :(",
        createdAt: "2026-03-02T09:31:12Z"
    },
    {
        id: 3,
        category: "Pets",
        merchant: "Animax",
        amount: 12,
        currency: "RON",
        type: "Expense",
        mood: "happy",
        date: "2026-03-01",
        method: "Card",
        createdAt: "2026-03-01T18:42:03Z"
    },
    {
        id: 4,
        category: "Gaming",
        merchant: "PlayStation Plus",
        amount: 79,
        currency: "RON",
        type: "Expense",
        recurring: {
            frequency: "monthly",
            dayOfMonth: 4,
            startDate: "2026-02-04"
        },
        method: "Card",
        createdAt: "2026-02-04T21:34:39Z"
    },
    {
        id: 5,
        category: "Entertainment",
        merchant: "Netflix",
        amount: 30,
        currency: "RON",
        type: "Expense",
        recurring: {
            frequency: "monthly",
            dayOfMonth: 12,
            startDate: "2025-09-12"
        },
        method: "Card",
        createdAt: "2025-09-12T10:46:05Z"
    },
    {
        id: 6,
        category: "Income",
        merchant: "Salary",
        amount: 4000,
        currency: "RON",
        type: "Income",
        recurring: {
            frequency: "monthly",
            dayOfMonth: 14,
            startDate: "2024-01-14"
        },
        method: "Card",
        createdAt: "2024-01-14T20:01:08Z"
    },
    {
        id: 7,
        category: "Clothing",
        merchant: "Stradivarius",
        amount: 130,
        currency: "RON",
        type: "Expense",
        mood: "happy",
        date: "2026-02-25",
        method: "Card",
        notes: "I found jeans that finally fit me...?",
        createdAt: "2026-02-25T16:19:12Z"
    },
    {
        id: 8,
        category: "Clothing",
        merchant: "H&M",
        amount: 90,
        currency: "RON",
        type: "Expense",
        mood: "happy",
        date: "2026-02-25",
        method: "Cash",
        createdAt: "2026-02-25T16:18:40Z"
    },
    {
        id: 9,
        category: "Coffee",
        merchant: "Manufaktura",
        amount: 35,
        currency: "RON",
        type: "Expense",
        mood: "calm",
        date: "2026-01-24",
        recurring: null,
        method: "Card",
        createdAt: "2026-01-24T17:23:19Z"
    },
]