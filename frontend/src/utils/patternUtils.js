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