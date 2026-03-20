import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/ChallengeItem.css"

function ChallengeItem({ challenge }) {
    const progress = Math.min((challenge.progress / challenge.target) * 100, 100)

    function formatProgress(c) {
        if (c.display === "percent") {
            return `${Math.round(c.progress)}%`
        }

        return `${c.progress}/${c.target}`
    }

    return (
        <Card className="challenge-item">
            <div>
                <p className="challenge-title">{challenge.title}</p>
                <p className="challenge-description">{challenge.description}</p>
                <p className="challenge-progress">{formatProgress(challenge)}</p>
            </div>

            <ProgressBar progress={progress} />
        </Card>
    )
}

export default ChallengeItem