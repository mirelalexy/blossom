import { useState } from "react"

import { useChallenges } from "../store/ChallengeStore"

import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import ChallengeItem from "../components/challenges/ChallengeItem"

import "../styles/pages/Challenges.css"

function Challenges() {
    const { challenges } = useChallenges()
    const [filter, setFilter] = useState("all")

    const filteredChallenges = challenges.filter(c => {
        if (filter === "all") return true
        return c.period === filter
    })

    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        const aPercent = a.progress / a.target
        const bPercent = b.progress / b.target

        // completed last
        if (a.completed && !b.completed) return 1
        if (b.completed && !a.completed) return -1

        // active first
        if (a.progress > 0 && b.progress === 0) return -1
        if (b.progress > 0 && a.progress === 0) return 1

        return bPercent - aPercent
    })

    return (
        <div className="page">
            <PageHeader title="Challenges"></PageHeader>
            
            <div className="challenges-filters">
                <Button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All
                </Button>

                <Button
                    className={filter === "weekly" ? "active" : ""}
                    onClick={() => setFilter("weekly")}
                >
                    Weekly
                </Button>

                <Button
                    className={filter === "monthly" ? "active" : ""}
                    onClick={() => setFilter("monthly")}
                >
                    Monthly
                </Button>
            </div>

            <div className="challenges-list">
                {sortedChallenges.map(c => (
                    <ChallengeItem key={c.id} challenge={c} />
                ))}
            </div>
        </div>
    )
}

export default Challenges