import { useNavigate } from "react-router-dom"

import Icon from "../ui/Icon"
import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

import "../../styles/components/LevelCard.css"

function LevelCard({ title, level, description, story, progress, variant="default", clickable=true }) {
    const navigate = useNavigate()

    const isHero = variant === "hero"

    return (
        <Card
            title={!isHero ? "Current Stage" : null}
            icon={!isHero ? <Icon name="categories" size={20} /> : null}
            className={`level-card-content ${variant}`}
            onClick={clickable && !isHero ? () => navigate("/journey") : undefined}
        >
            {!isHero ? (
                <p className="level-title">
                    {title} • Level {level}
                </p>
            ) : (
                <>
                    <p className="level-title">{title}</p>
                    <p className="level-level">Level {level}</p>
                </>
            )}
            
            <ProgressBar progress={progress} />

            {!isHero && (
                <p className="level-subtitle">See and understand your journey.</p>
            )}
        </Card>
    )
}

export default LevelCard