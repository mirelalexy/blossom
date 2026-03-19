import Icon from "../ui/Icon"
import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/LevelCard.css"

function LevelCard({ title, level, description, story, progress }) {
    return (
        <Card
            title="Current Stage"
            icon={<Icon name="categories" size={20} />}
            className="level-card-content"
        >
            <p className="level-title">{title} • Level {level}</p>

            <ProgressBar progress={progress}  />
        </Card>
    )
}

export default LevelCard