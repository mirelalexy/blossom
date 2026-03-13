export function searchTransactions(transactions, query) {
    if (!query) return transactions

    const q = query.toLowerCase()

    return transactions.filter((t) => 
        t.merchant?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
    )
}