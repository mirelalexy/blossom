import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/ChallengePreviewItem.css"

function ChallengeItem({ challenge }) {
    const progress = Math.min((challenge.progress / challenge.target) * 100, 100)

    return (
        <Card className="challenge-preview-item">
            <div>
                <p className="challenge-title">{challenge.title}</p>
                <p className="challenge-description">{challenge.description}</p>
                <p className="challenge-progress">{challenge.progress}/{challenge.target}</p>
            </div>

            <ProgressBar progress={progress} />
        </Card>
    )
}

export default ChallengeItem