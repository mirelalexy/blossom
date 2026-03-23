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