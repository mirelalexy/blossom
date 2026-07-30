import { useState } from "react"

import { useCheckIn } from "../../store/CheckInStore"
import { isEvilMode } from "../../utils/evilBlossom"

import Card from "../ui/Card"
import MoodSelector from "../forms/MoodSelector"
import Icon from "../ui/Icon"

import "../../styles/components/DailyCheckInCard.css"
import Button from "../ui/Button"

function DailyCheckInCard() {
    const { todayCheckIn, loading, addCheckIn } = useCheckIn()
    const [mood, setMood] = useState("")
    const isEvil = isEvilMode()

    if (loading) return null

    if (todayCheckIn) {
        return (
            <Card className="daily-check-in daily-check-in-done">
                <p className="daily-check-in-done-text">
                    {isEvil ? "Checked in. Fine." : "You checked in today. Good job."}
                </p>
            </Card>
        )
    }

    function handleSelect(value) {
        setMood(value)
        addCheckIn(value)
    }

    return (
        <Card
            className="daily-check-in"
            title="Daily check-in"
            icon={<Icon name="checkLine" size={20} />}
        >
            <p className="daily-check-in-prompt">
                {isEvil ? "How's today, really?" : "How's today going?"}
            </p>

            <MoodSelector value={mood} onChange={handleSelect} />
        </Card>
    )
}

export default DailyCheckInCard