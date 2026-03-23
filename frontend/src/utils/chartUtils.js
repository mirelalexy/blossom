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