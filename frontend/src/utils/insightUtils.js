import { formatCurrency } from "./currencyUtils.js"

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

export function getMoodInsight(data, currency = "") {
    if (!data || data.length === 0) return {
        insight: null,
        tip: null
    }

    const topMood = data[0].name.toLowerCase()
    const total = data.reduce((s, d) => s + d.value, 0)
    const topPct = total > 0 ? Math.round((data[0].value / total) * 100) : 0
    const anxiousPct = Math.round(((data.find(d => d.name.toLowerCase() === "anxious")?.value || 0) / total) * 100)

    let insight = ""
    let tip = ""

    if (topMood === "anxious") {
        insight = `${topPct}% of your tracked spending happened when you were anxious - the highest of any mood.`
        tip = `Anxious spending is often about relief, not the thing being bought. Noticing the moment before you spend is more useful than reviewing it after.`
    } else if (topMood === "happy") {
        insight = `You tend to spend the most when you're happy - ${topPct}% of tracked spending.`
        tip = anxiousPct > 20
            ? `Happy spending is usually fine, but you also have ${anxiousPct}% anxious spending in there. Keep an eye on that.`
            : `Spending when happy tends to be more intentional. Just make sure celebration spending stays proportionate.`
    } else if (topMood === "calm") {
        insight = `${topPct}% of your tagged spending happened when you felt calm.`
        tip = `Calm spending is usually the most deliberate - buying things you've thought about, not things you're reacting to. That's a good pattern.`
    } else if (topMood === "sad") {
        insight = `${topPct}% of your spending was logged when you were feeling low.`
        tip = `Spending when sad is worth watching - not because it's always wrong, but because it's the mood most likely to lead to regret. Be gentle with yourself about it.`
    } else {
        insight = `Most of your spending (${topPct}%) happens in a neutral state.`
        tip = `Neutral spending is routine spending - not driven by emotion, which is generally stable. Just make sure routine doesn't become invisible.`
    }

    return { insight, tip }
}

export function getTimeInsight(data, currency = "") {
    if (!data || data.length < 2) return {
        insight: null,
        tip: null
    }

    const values = data.map(d => d.value)
    const first = values[0]
    const last = values[values.length - 1]
    const recentAvg = values.slice(-3).reduce((s, v) => s + v, 0) / Math.min(3, values.length)
    const avg = values.reduce((s, v) => s + v, 0) / values.length

    let insight = ""
    let tip = ""

    if (last > first * 1.4) {
        const pct = Math.round(((last - first) / first) * 100)
        insight = `Your spending climbed through the period - ending ${pct}% higher than it started.`
        tip = `The trend is upward. Check whether the increase was intentional or whether spending gradually drifted without a clear reason.`
    } else if (last < first * 0.7) {
        const pct = Math.round(((first - last) / first) * 100)
        insight = `Your spending dropped through the period - ending ${pct}% lower than it started.`
        tip = `That's a meaningful improvement. Whether it came from habits changing or circumstances shifting, the direction is worth reinforcing.`
    } else if (recentAvg > avg * 1.3) {
        insight = `Spending picked up toward the end of the period.`
        tip = `The recent days are running above your period average. It might be end-of-period catch-up, or a pattern worth watching next month.`
    } else {
        insight = `Your spending was fairly consistent across the period.`
        tip = `Consistency usually signals deliberate habits rather than reactive spending. As long as the level itself makes sense, this is a good sign.`
    }

    return { insight, tip }
}

export function getIncomeExpenseInsight(data, currency = "") {
    if (!data || data.length === 0) return {
        insight: null,
        tip: null
    }

    const income = data.find(d => d.name === "Income")?.value || 0
    const expenses = data.find(d => d.name === "Expenses")?.value || 0

    if (income === 0 && expenses === 0) return {
        insight: null,
        tip: null
    }

    let insight = ""
    let tip = ""

    if (income === 0) {
        insight = "No income has been logged this period - only expenses."
        tip = "Logging your income gives me a complete picture. Without it, I can only see one side."
    } else if (expenses === 0) {
        insight = "You've logged income but no expenses this period."
        tip = "Either expenses haven't been logged yet, or this was an unusually quiet spending period."
    } else {
        const surplus = income - expenses
        const ratio = Math.round((expenses / income) * 100)
        const savePct = Math.max(0, 100 - ratio)

        if (surplus > 0) {
            insight = `You spent ${ratio}% of your logged income - keeping ${savePct}% (${formatCurrency(surplus, currency)}) unspent.`
            tip = savePct >= 20
                ? `A savings rate above 20% is considered healthy. The question is whether that unspent amount is being directed somewhere intentional.`
                : `You're spending most of what you earn. Having even a small buffer makes a difference over time.`
        } else if (surplus < 0) {
            insight = `Your expenses (${formatCurrency(expenses, currency)}) exceeded your logged income (${formatCurrency(income, currency)}) this period.`
            tip = `A deficit isn't always a problem - some income may not be logged yet. But if it reflects reality, it's worth understanding what drove it.`
        } else {
            insight = "Your income and expenses are exactly balanced this period."
            tip = "Balanced is stable, but leaves no margin. Even a small gap builds resilience over time."
        }
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