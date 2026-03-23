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
    }))
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