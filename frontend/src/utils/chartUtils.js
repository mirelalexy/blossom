export function getCategoryData(transactions, categories, colors) {
    const categoryMap = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return

        const category = categories.find(c => c.id === t.categoryId)
        const name = category.name
        
        categoryMap[name] = (categoryMap[name] || 0) + t.amount
    })

    return Object.entries(categoryMap).map(([name, value], index) => ({
        name,
        value,
        fill: colors[index % colors.length]
    })).sort((a, b) => b.value - a.value)
}

export function getChartColors() {
    const style = getComputedStyle(document.documentElement)

    return [
        style.getPropertyValue("--chart-1").trim(),
        style.getPropertyValue("--chart-2").trim(),
        style.getPropertyValue("--chart-3").trim(),
        style.getPropertyValue("--chart-4").trim(),
        style.getPropertyValue("--chart-5").trim()
    ]
}

export function getSpendingOverTime(transactions) {
    const map = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return

        const date = t.date

        map[date] = (map[date] || 0) + t.amount
    })

    return Object.entries(map).map(([date, value]) => ({
        date,
        value
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getIntentData(transactions, colors) {
    const intentMap = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return
        if (!t.intent) return

        const name = t.intent
        
        intentMap[name] = (intentMap[name] || 0) + t.amount
    })

    return Object.entries(intentMap).map(([name, value], index) => {
        return {
            name,
            value,
            fill: colors[index % colors.length]
        }
    }).sort((a, b) => b.value - a.value)
}

export function getMoodData(transactions, colors) {
    const moodMap = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return
        if (!t.mood) return

        const mood = t.mood
        const name = mood.charAt(0).toUpperCase() + mood.slice(1)
        
        moodMap[name] = (moodMap[name] || 0) + t.amount
    })

    return Object.entries(moodMap).map(([name, value], index) => {
        return {
            name,
            value,
            fill: colors[index % colors.length]
        }
    }).sort((a, b) => b.value - a.value)
}

export function getIncomeExpenseData(transactions, colors) {
    let income = 0
    let expenses = 0

    transactions.forEach(t => {
        if (t.type === "Income") income += t.amount
        else if (t.type === "Expense") expenses += t.amount
    })

    return [
        {
            name: "Income",
            value: income,
            fill: colors[0]
        },
        {
            name: "Expenses",
            value: expenses,
            fill: colors[1]
        }
    ]
}

export function getTopMerchantsData(transactions, limit = 3) {
    const merchantMap = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return
        if (!t.merchant) return

        const name = t.merchant.trim()
        
        merchantMap[name] = (merchantMap[name] || 0) + t.amount
    })

    return Object.entries(merchantMap).map(([name, value]) => {
        return {
            name,
            value
        }
    }).sort((a, b) => b.value - a.value).slice(0, limit)
}