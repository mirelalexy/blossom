import { useNavigate } from "react-router-dom"

import Icon from "../ui/Icon"
import Card from "../ui/Card"

import "../../styles/components/RewardsCard.css"

function RewardsCard({ ready = 0, locked = 0 }) {
    const navigate = useNavigate()

    const hasRewards = ready.length > 0 || locked.length > 0

    return (
        <Card
            className={`rewards-card-content`}
            onClick={() => navigate("/rewards")}
        >
            <h3 className="rewards-card-title">Rewards</h3>
            {!hasRewards ? (
                <div className="rewards-card-empty">
                    <p className="rewards-card-subtitle">You haven't added any rewards yet</p>
                    <p className="secondary-text">Create a reward to stay motivated</p>
                </div>
            ) : (
                <>
                    <div className="rewards-card-info">
                        {ready.length > 0 && (
                            <p>{ready.length} ready to claim</p>
                        )}

                        {locked.length > 0 && (
                            <p>{locked.length} locked</p>
                        )}
                    </div>

                    <p className="rewards-card-subtitle">Keep going. You're earning it.</p>
                </>
            )}
        </Card>
    )
}

export default RewardsCard