import { useCurrency } from "../../store/CurrencyStore"
import { formatCurrency } from "../../utils/currencyUtils"

import Card from "../ui/Card"
import EmptyState from "../ui/EmptyState"
import Icon from "../ui/Icon"
import ProgressBar from "../ui/ProgressBar"

import "./PrimaryGoalCard.css"

function PrimaryGoalCard({ goal }) {
    const { currency } = useCurrency()

    if (!goal) {
        return (
            <EmptyState title="No primary goal set." />
        )
    }

    const progress = Math.round((goal.saved / goal.target) * 100)

    return (
        <Card 
            className="primary-goal-card" 
            title="Primary Goal" 
            icon={
            <Icon name="primaryGoal" size={20} />
            }
        >
            <p>{goal.name}</p>
            <div className="goal-progress">
                <ProgressBar progress={progress}/>

                <div className="goal-meta">
                    <span>{formatCurrency(goal.saved, currency)} saved</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </Card>
    )
}

export default PrimaryGoalCard