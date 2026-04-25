import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useGoals } from "../../store/GoalsStore"
import { useCurrency } from "../../store/CurrencyStore"
import { useTransactions } from "../../store/TransactionStore"
import { useCategories } from "../../store/CategoryStore"

import { formatCurrency } from "../../utils/currencyUtils"
import { parseLocalDate } from "../../utils/dateUtils"

import Button from "../ui/Button"
import ProgressBar from "../ui/ProgressBar"
import Icon from "../ui/Icon"

import "../../styles/components/SavingGoalCard.css"

function SavingGoalCard({ goal }) {
    const navigate = useNavigate()

    const { deleteGoal, addToGoal, withdrawFromGoal } = useGoals()
    const { currency } = useCurrency()
    const { addTransaction } = useTransactions()
    const { categories } = useCategories()

    const [mode, setMode] = useState(null)  // null / add / withdraw
    const [amount, setAmount] = useState("")
    const [error, setError] = useState("")
    const [expanded, setExpanded] = useState(false)

    const goalsExpenseCategory = categories.find(
        cat => cat.name === "Goals" && cat.type === "expense"
    )

    const goalsIncomeCategory = categories.find(
        cat => cat.name === "Goals" && cat.type === "income"
    )

    const progress = goal.target_amount
        ? Math.round((goal.current_amount / goal.target_amount) * 100) 
        : 0

    const remaining = goal.target_amount - goal.current_amount
    const isComplete = progress >= 100

    const hasDetails = goal.notes || goal.link || goal.saving_mode

    function openMode(mode) {
        setMode(mode)
        setAmount("")
        setError("")
    }

    function handleAction() {
        const val = Number(amount)

        if (!val || val <= 0) {
            setError("Enter a valid amount.")
            return
        }

        if (mode === "add") {
            if (val > remaining) {
                setError(`That would exceed your goal by ${formatCurrency(val - remaining, currency)}.`)
                return
            }

            if (!goalsExpenseCategory) {
                setError("Goals expense category missing.")
                return
            }

            addToGoal(goal.id, val)

            addTransaction({
                title: `Saved for ${goal.name}`,
                amount: val,
                type: "expense",
                categoryId: goalsExpenseCategory.id,
                date: new Date().toISOString().slice(0, 10),
                method: "card",
                mood: null,
                intent: "planned",
                notes: ""
            })
        } else {
            if (val > goal.current_amount) {
                setError(`Only ${formatCurrency(goal.current_amount, currency)} available to withdraw.`)
                return
            }

            if (!goalsIncomeCategory) {
                setError("Goals income category missing.")
                return
            }

            withdrawFromGoal(goal.id, val)

            addTransaction({
                title: `Withdrew from ${goal.name}`,
                amount: val,
                type: "income",
                categoryId: goalsIncomeCategory.id,
                date: new Date().toISOString().slice(0, 10),
                method: "card",
                mood: null,
                intent: null,
                notes: ""
            })
        }

        setMode(null)
        setAmount("")
        setError("")
    }

    return (
        <div className={`goal-card ${isComplete ? "goal-card--complete" : ""}`}>
            <div className="goal-header">
                <div className="goal-header-first-row">
                    <h3>{goal.name}</h3>

                    <div className="goal-header-btns">
                        <button
                            className="goal-icon-btn"
                            onClick={() => navigate(`/goals/edit/${goal.id}`)}
                            aria-label="Edit goal"
                        >
                            <Icon name="edit" size={16} />
                        </button>
                        <button
                            className="goal-icon-btn goal-icon-btn--delete"
                            onClick={() => deleteGoal(goal.id)}
                            aria-label="Delete goal"
                        >
                            <Icon name="delete" size={16} />
                        </button>
                    </div>
                </div>

                <div className="goal-meta-row">
                    {goal.deadline && (
                        <span className="goal-meta-chip">
                            <Icon name="calendar" size={12} />
                            {parseLocalDate(goal.deadline)?.toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                            })}
                        </span>
                    )}

                    {goal.is_primary && (
                        <span className="goal-meta-chip goal-meta-chip--primary">Primary</span>
                    )}

                    {goal.saving_mode === "auto" && !isComplete && (
                        <span className="goal-meta-chip goal-meta-chip--auto">Auto</span>
                    )}

                    {isComplete && (
                        <span className="goal-meta-chip goal-meta-chip--done">Reached</span>
                    )}
                </div>
            </div>
            
            <div className="goal-stats">
                <div className="goal-stats-info">
                    <span>{formatCurrency(goal.current_amount, currency)}</span>
                    <span>{progress}%</span>
                </div>

                <ProgressBar progress={progress} />

                <div className="goal-target-row">
                    <span className="secondary-text">of {formatCurrency(goal.target_amount, currency)}</span>
                    
                    {!isComplete && (
                        <span className="secondary-text">{formatCurrency(remaining, currency)} to go</span>
                    )}
                </div>
            </div>

            {hasDetails && (
                <div className="goal-details">
                    <button
                        className="goal-details-toggle"
                        onClick={() => setExpanded(v => !v)}
                    >
                        <span>{expanded ? "Hide Details" : "Show Details"}</span>
                        <Icon name={expanded ? "hideDetails" : "seeDetails"} size={14} />
                    </button>

                    {expanded && (
                        <div className="goal-details-body">
                            {goal.saving_mode && (
                                <div className="goal-detail-row">
                                    <span className="goal-detail-label">Saving Mode</span>
                                    <span className="goal-detail-value" style={{ textTransform: "capitalize" }}>
                                        {goal.saving_mode}
                                    </span>
                                </div>
                            )}

                            {goal.notes && (
                                <div className="goal-detail-row goal-detail-row--notes">
                                    <span className="goal-detail-label">Notes</span>
                                    <p className="goal-detail-value goal-detail-notes">
                                        {goal.notes}
                                    </p>
                                </div>
                            )}

                            {goal.link && (
                                <div className="goal-detail-row">
                                    <span className="goal-detail-label">Link</span>
                                    <a
                                        href={goal.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="goal-detail-link"
                                    >
                                        Open →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {mode && (
                <div className="goal-inline-input">
                    <p className="goal-inline-label">
                        {mode === "add" ? `Add to ${goal.name}` : `Withdraw from ${goal.name}`}
                    </p>
                    <div className="goal-inline-row">
                        <input
                            className="goal-amount-input"
                            type="number"
                            min={0.01}
                            step="any"
                            placeholder={`Amount in ${currency}`}
                            value={amount}
                            onChange={e => { 
                                setAmount(e.target.value); 
                                setError("") 
                            }}
                            autoFocus
                        />
                        <button className="goal-confirm-btn" onClick={handleAction}>
                            <Icon name="completed" size={18} />
                        </button>
                        <button className="goal-cancel-btn" onClick={() => setMode(null)}>
                            <Icon name="delete" size={18} />
                        </button>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                </div>
            )}

            {!mode && !isComplete && (
                <div className="goal-actions">
                    <Button onClick={() => openMode("add")}>Add Funds</Button>
                    <Button className="secondary" onClick={() => openMode("withdraw")}>
                        Withdraw
                    </Button>
                </div>
            )}
        </div>
    )
}

export default SavingGoalCard