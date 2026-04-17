import { useNavigate } from "react-router-dom"

import Icon from "../ui/Icon"
import Card from "../ui/Card"

import "../../styles/components/RewardsCard.css"

function RewardsCard({ ready, locked }) {
    const navigate = useNavigate()

    return (
        <Card
            className={`rewards-card-content`}
            onClick={navigate("/rewards")}
        >
            {(ready || locked) && (
                <>
                    <h3 className="rewards-card-title">View your rewards</h3>
                    <div className="rewards-card-info">
                        <p>{ready} ready to claim</p>
                        <p>{locked} locked</p>
                    </div>
                </>
            )}
            
            <p className="rewards-card-subtitle">Need some motivation to complete your tasks?</p>
        </Card>
    )
}

export default RewardsCard