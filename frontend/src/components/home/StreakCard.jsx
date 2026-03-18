import Icon from "../ui/Icon"
import Card from "../ui/Card"

import "../../styles/components/StreakCard.css"

function StreakCard({ streak, message, nextMileStone }) {
    return (
        <Card
            title="Streak"
            icon={<Icon name="streak" size={20} />}
            className="streak-card-content"
        >
            <div>
                <h3 className="streak-number">{streak} day streak together</h3> 
                <p className="streak-message">{message}</p>
                <p className="streak-milestone">Next milestone: {nextMileStone} days</p>
            </div>
        </Card>
    )
}

export default StreakCard