import Button from "../ui/Button"
import ProgressBar from "../ui/ProgressBar"
import Icon from "../ui/Icon"

import "../../styles/components/SavingGoalCard.css"

function SavingGoalCard({ goal }) {
    const progress = Math.round((goal.saved / goal.target) * 100)
    const remaining = goal.target - goal.saved

    return (
        <div className="goal-card">
            <div className="goal-header">
                <div className="goal-header-first-row">
                    <h3>{goal.name}</h3>
                    <Icon name="delete" size={18} />
                </div>

                <p className="goal-header-second-row">Target: <strong>{goal.target} {goal.currency}</strong></p>
            </div>
            
            <div className="goal-stats">
                <ProgressBar progress={progress} />

                <div className="goal-stats-info">
                    <span>{goal.saved} {goal.currency} saved</span>
                    <span>{progress}%</span>
                </div>
            </div>
            
            <p className="italic-p"><strong>{remaining} {goal.currency}</strong> remaining</p>

            <div className="goal-actions">
                <Button>Add Funds</Button>
                <Button>Withdraw</Button>
            </div>
        </div>
    )
}

export default SavingGoalCard