import Card from "../ui/Card";
import Icon from "../ui/Icon";
import ProgressBar from "../ui/ProgressBar";

import "./PrimaryGoalCard.css"

function PrimaryGoalCard() {
    const percent = 50;
    const sum = 2500;
    const currency = "RON";
    const primaryGoal = "Bali";

    return (
        <Card 
            className="primary-goal-card" 
            title="Primary Goal" 
            icon={
            <Icon name="primaryGoal" size={20} />
            }
        >
            <p>{primaryGoal}</p>
            <div className="goal-progress">
                <ProgressBar progress={percent}/>

                <div className="goal-meta">
                    <span>{sum} {currency} saved</span>
                    <span>{percent}%</span>
                </div>
            </div>
        </Card>
    )
}

export default PrimaryGoalCard;