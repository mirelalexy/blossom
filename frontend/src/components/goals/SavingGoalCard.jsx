import { useGoals } from "../../store/GoalsStore"
import { useCurrency } from "../../store/CurrencyStore"
import { useTransactions } from "../../store/TransactionStore"
import { useCategories } from "../../store/CategoryStore"

import { formatCurrency } from "../../utils/currencyUtils"

import Button from "../ui/Button"
import ProgressBar from "../ui/ProgressBar"
import Icon from "../ui/Icon"

import "../../styles/components/SavingGoalCard.css"

function SavingGoalCard({ goal }) {
    const { deleteGoal, addToGoal, withdrawFromGoal } = useGoals()
    const { currency } = useCurrency()
    const { addTransaction } = useTransactions()
    const { categories } = useCategories()

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

    return (
        <div className="goal-card">
            <div className="goal-header">
                <div className="goal-header-first-row">
                    <h3>{goal.name}</h3>
                    <button onClick={() => deleteGoal(goal.id)} className="delete-goal-btn">
                        <Icon name="delete" size={18} />
                    </button>
                </div>

                <p className="goal-header-second-row">Target: <strong>{formatCurrency(goal.target_amount, currency)}</strong></p>
            </div>
            
            <div className="goal-stats">
                <ProgressBar progress={progress} />

                <div className="goal-stats-info">
                    <span>{formatCurrency(goal.current_amount, currency)} saved</span>
                    <span>{progress}%</span>
                </div>
            </div>
            
            <p className="italic-p"><strong>{formatCurrency(remaining, currency)}</strong> remaining</p>

            <div className="goal-actions">
                <Button 
                    onClick={() => {
                        const amount = Number(prompt("Add funds"))
                        if (!amount || isNaN(amount) || amount <= 0) return

                        if (goal.current_amount + amount > goal.target_amount) {
                            alert("You exceeded your goal!")
                            return
                        }

                        if (!goalsExpenseCategory) {
                            alert("Goals category missing")
                            return
                        }

                        addToGoal(goal.id, amount)
                        

                        addTransaction({
                            title: `Saved for ${goal.name}`,
                            amount: amount,
                            type: "expense",
                            categoryId: goalsExpenseCategory.id,
                            date: new Date().toISOString(),
                            method: "card",
                            mood: null,
                            intent: null,
                            notes: ""
                        })
                    }}
                >
                    Add Funds
                </Button>
                <Button 
                    onClick={() => {
                        const amount = Number(prompt("Withdraw funds"))
                        if (!amount || isNaN(amount) || amount <= 0) return

                        if (goal.current_amount - amount < 0) {
                            alert("Amount not available!")
                            return
                        }

                        if (!goalsIncomeCategory) {
                            alert("Goals category missing")
                            return
                        }

                        withdrawFromGoal(goal.id, amount)

                        addTransaction({
                            title: `Withdrew from ${goal.name}`,
                            amount: amount,
                            type: "income",
                            categoryId: goalsIncomeCategory.id,
                            date: new Date().toISOString(),
                            method: "card",
                            mood: null,
                            intent: null,
                            notes: ""
                        })
                    }}
                >
                    Withdraw Funds
                </Button>
            </div>
        </div>
    )
}

export default SavingGoalCard