export function formatCurrency(amount, currency) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency
    }).format(amount)
}