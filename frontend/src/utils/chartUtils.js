export function getCategoryData(transactions, categories) {
    const categoryMap = {}

    transactions.forEach(t => {
        if (t.type !== "Expense") return

        const category = categories.find(c => c.id === t.categoryId)
        const name = category.name
        
        categoryMap[name] = (categoryMap[name] || 0) + t.amount
    })

    return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value
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