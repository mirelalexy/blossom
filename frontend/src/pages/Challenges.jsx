import { useState } from "react"

import { useChallenges } from "../store/ChallengeStore"

import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import ChallengeItem from "../components/challenges/ChallengeItem"

import "../styles/pages/Challenges.css"

const FILTERS = [
    { value: "all", label: "All" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
]

function Challenges() {
    const { challenges } = useChallenges()
    const [filter, setFilter] = useState("all")

    const filteredChallenges = challenges.filter(c =>
        filter === "all" || c.period === filter
    )

    const sortedChallenges = [...filteredChallenges].sort((a, b) => {
        // completed last
        if (a.completed && !b.completed) return 1
        if (b.completed && !a.completed) return -1

        // active first
        if (a.progress > 0 && b.progress === 0) return -1
        if (b.progress > 0 && a.progress === 0) return 1

        const aPercent = a.progress / a.target
        const bPercent = b.progress / b.target

        return bPercent - aPercent
    })

    const activeCount = filteredChallenges.filter(c => c.progress > 0 && !c.completed).length
    const completedCount = filteredChallenges.filter(c => c.completed).length

    return (
        <div className="page">
            <PageHeader title="Challenges" />
            
            <div className="challenge-filters">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        className={`challenge-filter-pill ${filter === f.value ? "active" : ""}`}
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filteredChallenges.length > 0 && (
                <p className="challenge-summary secondary-text">
                    {activeCount > 0
                        ? `${activeCount} in progress · ${completedCount} completed`
                        : completedCount > 0
                        ? `${completedCount} of ${filteredChallenges.length} completed this period`
                        : `${filteredChallenges.length} challenge${filteredChallenges.length === 1 ? "" : "s"} available`
                    }
                </p>
            )}

            {sortedChallenges.length === 0 ? (
                <EmptyState
                    title="No challenges here"
                    subtitle="Switch to a different filter to see more."
                />
            ) : (
                <div className="challenges-list">
                    {sortedChallenges.map(c => (
                        <ChallengeItem key={c.id} challenge={c} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Challenges