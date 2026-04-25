import { useMemo } from "react"

import { parseLocalDate } from "../../utils/dateUtils"
import { formatCurrency } from "../../utils/currencyUtils"
import { isCurrentMonth } from "../../utils/dateUtils"
import { isEvilMode, getEvilBudgetMessage } from "../../utils/evilBlossom"

import Card from "../ui/Card"
import Icon from "../ui/Icon"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/BudgetSnapshotCard.css"

function BudgetSnapshotCard({ transactions, budget, currency }) {
    const { spent, remaining, pct, label, tone } = useMemo(() => {
        const monthlyExpenses = transactions.filter(
            t => t.type === "expense" && isCurrentMonth(t.date)
        )

        const spent = monthlyExpenses.reduce((s, t) => s + t.amount, 0)
        const limit = Number(budget.monthly_limit) || 0
        const remaining = limit - spent
        const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0

        let label, tone

        if (pct === 0) {
            label = isEvilMode() ? getEvilBudgetMessage({ pct, remaining, currency }) : "You haven't spent anything yet this month."
            tone = "calm"
        } else if (pct < 50) {
            label = isEvilMode() ? getEvilBudgetMessage({ pct, remaining, currency }) : `${formatCurrency(remaining, currency)} still with us - you're doing well.`
            tone = "calm"
        } else if (pct < 80) {
            label = isEvilMode() ? getEvilBudgetMessage({ pct, remaining, currency }) : `Halfway through your budget. Still room to move gently.`
            tone = "neutral"
        } else if (pct < 100) {
            label = isEvilMode() ? getEvilBudgetMessage({ pct, remaining, currency }) : `Getting close... ${formatCurrency(remaining, currency)} remaining.`
            tone = "warn"
        } else {
            label = isEvilMode() ? getEvilBudgetMessage({ pct, remaining, currency }) : `You've gone over this month - that's okay. Noticing it is what matters.`
            tone = "over"
        }

        return { spent, remaining, pct, label, tone }
    }, [transactions, budget, currency])

    return (
        <Card
            title="Budget"
            icon={<Icon name="budget" size={20} />}
            className={`budget-snapshot budget-snapshot--${tone}`}
        >
            <div className="budget-snapshot-amounts">
                <span className="budget-snapshot-spent">
                    {formatCurrency(spent, currency)}
                </span>

                <span className="budget-snapshot-limit secondary-text">
                    of {formatCurrency(budget.monthly_limit, currency)}
                </span>
            </div>

            <ProgressBar progress={pct} />
            <p className="budget-snapshot-label secondary-text">{label}</p>
        </Card>
    )
}

export default BudgetSnapshotCard