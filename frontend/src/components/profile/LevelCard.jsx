import { useNavigate } from "react-router-dom"

import Icon from "../ui/Icon"
import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/LevelCard.css"

function LevelCard({ title, level, description, story, progress }) {
    const navigate = useNavigate()

    return (
        <Card
            title="Current Stage"
            icon={<Icon name="categories" size={20} />}
            className="level-card-content"
            onClick={() => navigate("/journey")}
        >
            <p className="level-title">{title} • Level {level}</p>

            <ProgressBar progress={progress}  />

            <p className="level-subtitle">See and understand your journey.</p>
        </Card>
    )
}

export default LevelCard