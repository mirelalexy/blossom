import { useCurrency } from "../store/CurrencyStore"
import { formatCurrency } from "./currencyUtils"

export function formatRule(rule) {
    const { currency } = useCurrency()

    switch(rule.type) {
        case "single_limit":
            return `When a single transaction exceeds: ${formatCurrency(rule.value, currency)}`

        case "weekly_count":
            return `Limit number of transactions per week: ${rule.value}`

        default:
            return ""
    }
}