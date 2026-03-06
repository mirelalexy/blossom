import PrimaryGoalCard from "./PrimaryGoalCard"
import TopCategoryCard from "./TopCategoryCard"

function StatsSection() {
    return (
        <div className="home-stats-section">
            <h3>Stats</h3>
            <PrimaryGoalCard />
            <TopCategoryCard />
        </div>
    )
}

export default StatsSection