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
        .filter(c => !c.completed)
        .slice(0, 3)

    return (
        <Section title="Challenges">
            <div className="challenges-preview">
                {activeChallenges.map(c => (
                    <ChallengePreviewItem key={c.id} challenge={c} />
                ))}
            </div>

            <Button onClick={() => navigate("/challenges")}>View all</Button>
        </Section>
    )
}

export default ChallengesPreview