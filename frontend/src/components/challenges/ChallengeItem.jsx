import { formatProgress } from "../../utils/challengeUtils"

import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"
import Icon from "../ui/Icon"

import "../../styles/components/ChallengeItem.css"

function ChallengeItem({ challenge }) {
    const progress = Math.min((challenge.progress / challenge.target) * 100, 100)

    return (
        <Card className={`challenge-item ${challenge.completed ? "completed" : ""}`}>
            <div className="challenge-top">
                <div className="challenge-header">
                    <p className="challenge-title">{challenge.title}</p>
                    <span className={`challenge-period-badge period-${challenge.period}`}>
                        {challenge.period}
                    </span>
                </div>

                {challenge.completed && (
                    <Icon name="completed" size={18} className="challenge-check"/>
                )}
            </div>
                
                <p className="challenge-description">{challenge.description}</p>

                <div className="challenge-footer">
                    <ProgressBar progress={progress} />
                    <p className="challenge-progress">{formatProgress(challenge)}</p>
                </div>
        </Card>
    )
}

export default ChallengeItem