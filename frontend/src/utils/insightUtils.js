export function getCategoryInsight(data) {
    if (!data || data.length === 0) return {
        insight: "No spending data yet.",
        tip: ""
    }

    const topCategory = data[0]

    const insight = `Most of your spending goes to ${topCategory.name}.`

    const tip = `Consider setting a small limit for ${topCategory.name.toLowerCase()} to keep things balanced.`

    return { insight, tip }
}

export function getIntentInsight(data) {
    if (!data || data.length === 0) return {
        insight: "No intent data yet.",
        tip: ""
    }

    const topIntent = data[0].name

    let insight = ""
    let tip = ""

    if (topIntent === "Planned") {
        insight = "Most of your spending is planned, which shows strong control over your finances."
        tip = "Keep planning ahead. It's clearly working for you."
    } else if (topIntent === "Impulse") {
        insight = "A large part of your spending happens on impulse."
        tip = "Try pausing before purchases to reduce impulsive spending."
    } else if (topIntent === "Necessary") {
        insight = "Most of your spending goes toward essentials."
        tip = "You're prioritizing needs well. Just keep it balanced."
    }

    return { insight, tip }
}

export function getMoodInsight(data) {
    if (!data || data.length === 0) return {
        insight: "No mood data yet.",
        tip: ""
    }

    const topMood = data[0].name

    let insight = `You tend to spend more when feeling ${topMood.toLowerCase()}.`
    let tip = ""

    if (topMood === "Anxious") {
        tip = "You might be using spending as a coping mechanism. Try noticing this pattern."
    } else if (topMood === "Calm") {
        tip = "Your spending seems to be tied to routine rather than emotional spikes."
    } else if (topMood === "Happy") {
        tip = "You might be rewarding yourself. That's good. Just keep it intentional."
    } else {
        tip = "Try noticing how your emotions influence your spending decisions."
    }

    return { insight, tip }
}

export function getTimeInsight(data) {
    if (!data || data.length < 2) return {
        insight: "Not enough data to detect a trend yet.",
        tip: ""
    }

    const first = data[0].value
    const last = data[data.length - 1].value

    let insight = ""
    let tip = ""

    if (last > first) {
        insight = "Your spending has increased over time."
        tip = "Try identifying what caused the increase to stay in control."
    } else if (last < first) {
        insight = "Your spending has decreased recently."
        tip = "You're moving in a good direction. Keep it up."
    } else {
        insight = "Your spending has remained relatively stable."
        tip = "Consistency is good. Just make sure it aligns with your goals."
    }

    return { insight, tip }
}

export function getIncomeExpenseInsight(data) {
    if (!data || data.length === 0) return {
        insight: "No data yet.",
        tip: ""
    }

    const income = data.find(d => d.name === "Income")?.value || 0
    const expenses = data.find(d => d.name === "Expenses")?.value || 0

    let insight = ""
    let tip = ""

    if (income === 0 && expenses > 0) {
        insight = "You have recorded expenses but no income."
        tip = "Try logging your income to get a complete financial picture."
    } else if (income > expenses) {
        insight = "Your income is higher than your expenses."
        tip = "You're in a good position. Consider saving or investing the difference."
    } else if (income < expenses) {
        insight = "Your expenses exceed your income."
        tip = "You may want to review your spending to avoid long-term imbalance."
    } else {
        insight = "Your income and expenses are balanced."
        tip = "This is stable. Just make sure you're also saving if possible."
    }

    return { insight, tip }
}

export function getBiggestExpense(transactions) {
    const expenses = transactions.filter(t => t.type === "Expense")

    if (!expenses || expenses.length === 0) return null

    return expenses.sort((a, b) => b.amount - a.amount)[0]
}

export function getSpendingStyle({ moodData, intentData }) {
    if (!moodData?.length || !intentData?.length) {
        return "Still figuring you out"
    }

    const mood = moodData[0].name
    const intent = intentData[0].name

    if (mood === "Calm" && intent === "Planned") {
        return "Intentional Spender"
    } else if (mood === "Anxious" && intent === "Impulse") {
        return "Emotional Spender"
    } else if (intent === "Necessary") {
        return "Practical Spender"
    } else if (intent === "Planned") {
        return "Organized Spender"
    } else if (intent === "Impulse") {
        return "Spontaneous Spender"
    } else if (mood === "Happy") {
        return "Reward-Driven Spender"
    } else if (mood === "Calm") {
        return "Routine Spender"
    } else if (mood === "Anxious") {
        return "Emotion-Driven Spender"
    } else {
        return "Balanced Spender"
    }
}

export function getSpendingStyleDetails(style) {
    const map = {
        "Intentional Spender": "You plan your spending and stay in control.",
        "Emotional Spender": "Your spending is often influenced by emotions.",
        "Practical Spender": "You focus on essentials and needs.",
        "Organized Spender": "You tend to think ahead before spending.",
        "Spontaneous Spender": "You enjoy making quick, unplanned purchases.",
        "Reward-Driven Spender": "You like to treat yourself when feeling good.",
        "Routine Spender": "Your spending follows consistent habits.",
        "Emotion-Driven Spender": "Your emotions influence your decisions.",
        "Balanced Spender": "You show a mix of different spending behaviors."
    }

    return map[style] || ""
}