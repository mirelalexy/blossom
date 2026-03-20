import { useNavigate } from "react-router-dom"

import { useChallenges } from "../../store/ChallengeStore"

import Section from "../ui/Section"
import Button from "../ui/Button"
import ChallengePreviewItem from "./ChallengePreviewItem"

import "../../styles/components/ChallengesPreview.css"

function ChallengesPreview() {
    const navigate = useNavigate()

    const { challenges } = useChallenges()

    const activeChallenges = challenges
        .filter(c => c.progress > 0 && !c.completed)
        .sort((a, b) => (b.progress / b.target) - (a.progress / a.target))

    const fallBackChallenges = challenges
        .filter(c => c.progress === 0 && !c.completed)

    const displayedChallenges = [
        ...activeChallenges,
        ...fallBackChallenges
    ].slice(0, 3)

    return (
        <Section title="Challenges">
            <div className="challenges-preview">
                {displayedChallenges.map(c => (
                    <ChallengePreviewItem key={c.id} challenge={c} />
                ))}
            </div>

            <Button onClick={() => navigate("/challenges")}>View all</Button>
        </Section>
    )
}

export default ChallengesPreview