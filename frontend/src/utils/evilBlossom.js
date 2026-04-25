import { formatCurrency } from "./currencyUtils"

export function isEvilMode() {
    return document.documentElement.getAttribute("data-theme") === "evil-blossom"
}

export function getEvilBudgetMessage({ pct, remaining, currency }) {
    if (pct === 0) return "Nothing spent yet. The month is full of potential."
    else if (pct < 50) return `${Math.round(pct)}% used. Still early. Don't get comfortable.`
    else if (pct < 80) return `${Math.round(pct)}% gone. Halfway through the budget, roughly.`
    else if (pct < 100) return `${Math.round(pct)}% used. You can see the edge from here.`
    else return `Over by ${formatCurrency(remaining, currency)}. It happened.`
}