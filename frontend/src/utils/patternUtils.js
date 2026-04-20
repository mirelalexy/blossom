import { parseLocalDate } from "./dateUtils.js"

export function getUserPatterns(transactions, currency = "") {
    const patterns = []

    if (!transactions || transactions.length === 0) return patterns

    const expenses = transactions.filter(t => t.type === "expense")
    const income = transactions.filter(t => t.type === "income")

    if (expenses.length < 3) return patterns

    // weekend vs weekday
    const weekendExp = expenses.filter(t => { 
        const d = parseLocalDate(t.date).getDay()
        return d === 0 || d === 6 
    })

    const weekdayExp = expenses.filter(t => {
        const d = parseLocalDate(t.date).getDay()
        return d !== 0 && d !== 6 
    })

    const weekendAvg = weekendExp.length ? weekendExp.reduce((s, t) => s + t.amount, 0) / weekendExp.length : 0
    const weekdayAvg = weekdayExp.length ? weekdayExp.reduce((s, t) => s + t.amount, 0) / weekdayExp.length : 0
    
    if (weekendExp.length >= 2 && weekdayExp.length >= 2) {
        if (weekendAvg > weekdayAvg * 1.3) {
            patterns.push({
                icon: "calendar",
                text: "You spend more on weekends.",
                detail: `Weekend transactions average ${fmt(weekendAvg, currency)} vs ${fmt(weekdayAvg, currency)} on weekdays. Weekend spending tends to be less routine - worth keeping an eye on.`
            })
        } else if (weekdayAvg > weekendAvg * 1.3) {
            patterns.push({
                icon: "calendar",
                text: "Your spending is heavier on weekdays.",
                detail: `Weekday transactions average ${fmt(weekdayAvg, currency)} vs ${fmt(weekendAvg, currency)} on weekends. That's usually routine and work-related spending.`
            })
        }
    }    

    // mood vs amount spent
    const moodAmounts = {}

    expenses.forEach(t => {
        if (!t.mood) return
        if (!moodAmounts[t.mood]) {
            moodAmounts[t.mood] = []
        }

        moodAmounts[t.mood].push(t.amount)
    })

    const moodAvgs = Object.entries(moodAmounts)
        .map(([mood, amounts]) => ({ mood, avg: amounts.reduce((s, a) => s + a, 0) / amounts.length, count: amounts.length }))
        .filter(m => m.count >= 2)
        .sort((a, b) => b.avg - a.avg)
    if (moodAvgs.length >= 2) {
        const highest = moodAvgs[0]
        const lowest = moodAvgs[moodAvgs.length - 1]
        const gap = highest.avg - lowest.avg
        
        if (gap > 10) {
            patterns.push({
                icon: "leaf",
                text: `You spend the most when you're ${highest.mood}.`,
                detail: `${cap(highest.mood)} spending averages ${fmt(highest.avg, currency)} per transaction - ${fmt(gap, currency)} more than when you're ${lowest.mood} (${fmt(lowest.avg, currency)}). That gap is worth noticing.`
            })
        }
    }

    // impulse vs planned
    const byIntent = {}

    expenses.forEach(t => {
        if (!t.intent) return
        if (!byIntent[t.intent]) {
            byIntent[t.intent] = []
        }

        byIntent[t.intent].push(t.amount)
    })

    const impulseArr = byIntent["impulse"]  || []
    const plannedArr = byIntent["planned"]  || []

    if (impulseArr.length >= 2 && plannedArr.length >= 2) {
        const impulseAvg = impulseArr.reduce((s, a) => s + a, 0) / impulseArr.length
        const plannedAvg = plannedArr.reduce((s, a) => s + a, 0) / plannedArr.length
        
        const taggedTotal = Object.values(byIntent).reduce((s, a)=> s + a.length, 0)
        const impulsePct = Math.round((impulseArr.length / taggedTotal) * 100)
        
        patterns.push({
            icon: "zap",
            text: impulseArr.length > plannedArr.length
                ? `More than half your tagged expenses are impulse purchases.`
                : `Impulse purchases average ${fmt(impulseAvg, currency)} each.`,
            detail: `${impulsePct}% of your tagged expenses are impulse. They average ${fmt(impulseAvg, currency)} - ${impulseAvg > plannedAvg ? fmt(impulseAvg - plannedAvg, currency) + " more" : fmt(plannedAvg - impulseAvg, currency) + " less"} than your planned purchases (${fmt(plannedAvg, currency)}).`
        })
    }

    // payment method (card vs cash)
    const cardExp = expenses.filter(t => t.method === "card")
    const cashExp = expenses.filter(t => t.method === "cash")

    if (cardExp.length > 0 && cashExp.length > 0) {
        const cardAvg = cardExp.reduce((s, t) => s + t.amount, 0) / cardExp.length
        const cashAvg = cashExp.reduce((s, t) => s + t.amount, 0) / cashExp.length
        
        const cardPct = Math.round((cardExp.length / expenses.length) * 100)
        
        if (cardAvg > cashAvg * 1.5) {
            patterns.push({
                icon: "transactions",
                text: `Card transactions average ${fmt(cardAvg - cashAvg, currency)} more than cash.`,
                detail: `${cardPct}% of your expenses are by card. Card purchases tend to feel less real - the gap between card and cash averages is often where unconscious spending hides.`
            })
        } else {
            patterns.push({
                icon: "transactions",
                text: `${cardPct}% of your spending is by card.`,
                detail: `Your card and cash averages are similar (${fmt(cardAvg, currency)} vs ${fmt(cashAvg, currency)}), which suggests you're equally intentional with both payment methods.`
            })
        }
    } else if (cardExp.length > 0 && cashExp.length === 0) {
        patterns.push({
            icon: "transactions",
            text: "All of your tracked spending is by card.",
            detail: "Card spending is precise and traceable. Just know that the distance from physical money can make it easier to spend without noticing."
        })
    }

    // recurring transactions (impact)
    const recurringExp = expenses.filter(t => t.is_recurring || t.recurring_parent_id)
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)

    const recurringTotal = recurringExp.reduce((s, t) => s + t.amount, 0)
    const nonRecurringTotal = totalExpenses - recurringTotal

    if (recurringExp.length >= 2 && totalExpenses > 0) {
        const pct = Math.round((recurringTotal / totalExpenses) * 100)

        patterns.push({
            icon: "transactions",
            text: `Recurring expenses account for ${pct}% of your spending.`,
            detail: `${fmt(recurringTotal, currency)} of your ${fmt(totalExpenses, currency)} total is locked in before you make a single discretionary decision. That leaves ${fmt(nonRecurringTotal, currency)} you actually choose where to spend.`
        })
    }

    // peak spending day
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayTotals = {}
        
    expenses.forEach(t => {
        const d = parseLocalDate(t.date).getDay()
        dayTotals[d] = (dayTotals[d] || 0) + t.amount
    })
        
    const sortedDays = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])
    
    if (sortedDays.length >= 3) {
        const [peakDay, peakTotal] = sortedDays[0]
            
        patterns.push({
            icon: "calendar",
            text: `${DAYS[peakDay]} is your highest spending day.`,
            detail: `You've spent ${fmt(peakTotal, currency)} across all ${DAYS[peakDay]}s this period. If that's a surprise, it's useful to know.`
        })
    }

    return patterns
}

function fmt(amount, currency) {
    if (!currency) return amount.toFixed(0)

    try {
        return new Intl.NumberFormat(undefined, { 
            style: "currency", 
            currency, maximumFractionDigits: 0 
        }).format(amount)
    } catch { 
        return `${amount.toFixed(0)} ${currency}` 
    }
}

function cap(s) { 
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s 
}