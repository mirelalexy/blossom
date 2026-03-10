import { useGoals } from "../../store/GoalsStore";
import Card from "../ui/Card";
import Icon from "../ui/Icon";
import ProgressBar from "../ui/ProgressBar";

import "./PrimaryGoalCard.css"

function PrimaryGoalCard({ goal }) {
    if (!goal) {
        return (
            <p>No primary goal set.</p>
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
                    <span>{goal.saved} {goal.currency} saved</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </Card>
    )
}

export default PrimaryGoalCard;