export function formatCurrency(amount, currencySymbol) {
    return `${amount.toLocaleString()} ${currencySymbol}`
}