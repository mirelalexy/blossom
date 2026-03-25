import { useGoals } from "../../store/GoalsStore"
import { useCurrency } from "../../store/CurrencyStore"

import { formatCurrency } from "../../utils/currencyUtils"

import Button from "../ui/Button"
import ProgressBar from "../ui/ProgressBar"
import Icon from "../ui/Icon"

import "../../styles/components/SavingGoalCard.css"

function SavingGoalCard({ goal }) {
    const { deleteGoal, updateGoalSaved, withdrawGoalSaved } = useGoals()
    const { currency } = useCurrency()

    const progress = Math.round((goal.saved / goal.target) * 100)
    const remaining = goal.target - goal.saved

    return (
        <div className="goal-card">
            <div className="goal-header">
                <div className="goal-header-first-row">
                    <h3>{goal.name}</h3>
                    <button onClick={() => deleteGoal(goal.id)} className="delete-goal-btn">
                        <Icon name="delete" size={18} />
                    </button>
                </div>

                <p className="goal-header-second-row">Target: <strong>{formatCurrency(goal.target, currency)}</strong></p>
            </div>
            
            <div className="goal-stats">
                <ProgressBar progress={progress} />

                <div className="goal-stats-info">
                    <span>{formatCurrency(goal.saved, currency)} saved</span>
                    <span>{progress}%</span>
                </div>
            </div>
            
            <p className="italic-p"><strong>{formatCurrency(remaining, currency)}</strong> remaining</p>

            <div className="goal-actions">
                <Button 
                    onClick={() => {
                        const amount = Number(prompt("Add funds"))
                        if (!amount) return

                        updateGoalSaved(goal.id, amount)
                    }}
                >
                    Add Funds
                </Button>
                <Button 
                    onClick={() => {
                        const amount = Number(prompt("Withdraw funds"))
                        if (!amount) return

                        withdrawGoalSaved(goal.id, amount)
                    }}
                >
                    Withdraw Funds
                </Button>
            </div>
        </div>
    )
}

export default SavingGoalCard