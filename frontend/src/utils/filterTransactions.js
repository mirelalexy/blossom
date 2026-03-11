export function filterTransactions(transactions, filters) {
    return transactions.filter((transaction) => {
        if(!matchesCategory(transaction, filters)) return false
        if(!matchesType(transaction, filters)) return false
        if(!matchesIntent(transaction, filters)) return false
        return true
    })
}

function matchesCategory(transaction, filters) {
    if(!filters.category) return true
    return transaction.category === filters.category
}

function matchesType(transaction, filters) {
    if(!filters.type) return true
    return transaction.type === filters.type
}

function matchesIntent(transaction, filters) {
    if(!filters.intent) return true
    return transaction.intent === filters.intent
}