export function getCategoryInsight(data, currency = "") {
    if (!data || data.length === 0) return {
        insight: null,
        tip: null
    }

    const top = data[0]
    const total = data.reduce((s, d) => s + d.value, 0)
    const pct = total > 0 ? Math.round((top.value / total) * 100) : 0

    const insight = pct >= 50
        ? `${top.name} alone accounts for ${pct}% of your spending - more than everything else combined.`
        : `${top.name} leads at ${pct}% of your total spending this period.`

    const tip = pct >= 60
        ? `When one category takes that much, it's worth asking whether it reflects a real priority or a pattern that grew unnoticed.`
        : data.length <= 2
        ? `You're spending in ${data.length === 1 ? "one category" : "two categories"}. That's focused - just make sure it's intentional.`
        : `Your spending is spread across ${data.length} categories. Healthy as long as the proportions match your priorities.`

    return { insight, tip }
}

export function getIntentInsight(data, currency = "") {
    if (!data || data.length === 0) return {
        insight: null,
        tip: null
    }

    const topIntent = data[0].name.toLowerCase()
    const total = data.reduce((s, d) => s + d.value, 0)
    const topPct = total > 0 ? Math.round((data[0].value / total) * 100) : 0
    const impulsePct = Math.round(((data.find(d => d.name.toLowerCase() === "impulse")?.value || 0) / total) * 100)

    let insight = ""
    let tip = ""

    if (topIntent === "planned") {
        insight = `${topPct}% of your spending was planned in advance this period.`
        tip = topPct >= 70
            ? `That's a high level of intentionality. If it feels right, keep going. If it feels restrictive, leave some room for spontaneity.`
            : `Planning ahead is working. The ${impulsePct}% impulse spending isn't alarming - some always exists.`
    } else if (topIntent === "impulse") {
        insight = `${topPct}% of your tagged spending happened on impulse - the largest category by amount.`
        tip = topPct >= 60
            ? `That's a significant share. Try logging before you buy - the act of pausing tends to slow things down.`
            : `A mix of impulse and planned is normal. The question is whether those impulse purchases felt worth it afterward.`
    } else if (topIntent === "necessary") {
        insight = `Most of your spending (${topPct}%) went toward necessities this period.`
        tip = topPct >= 70
            ? `Your budget is carrying a lot of essential weight. That's real - it just leaves less room for goals and discretionary choices.`
            : `Covering necessities is the baseline. The remaining ${100 - topPct}% is where choice lives.`
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
    const expenses = transactions.filter(t => t.type === "expense")

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