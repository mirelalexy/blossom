import { useCurrency } from "../store/CurrencyStore"
import { formatCurrency } from "./currencyUtils"

export function formatRule(rule) {
    const { currency } = useCurrency()

    switch(rule.type) {
        case "single_limit":
            return { number: formatCurrency(rule.value, currency), type: "Max amount for a transaction"}

        case "weekly_count":
            return { number: rule.value, type: "Max number of transactions per week"}

        default:
            return {}
    }
}