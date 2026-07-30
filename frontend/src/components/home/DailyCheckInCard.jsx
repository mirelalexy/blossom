import { useState } from "react"

import { useCheckIn } from "../../store/CheckInStore"
import { useUser } from "../../store/UserStore"
import { isEvilMode } from "../../utils/evilBlossom"

import Card from "../ui/Card"
import MoodSelector from "../forms/MoodSelector"
import Icon from "../ui/Icon"
import Textarea from "../forms/Textarea"
import Button from "../ui/Button"

import "../../styles/components/DailyCheckInCard.css"

const MAX_NOTES_LENGTH = 300

function DailyCheckInCard() {
    const { todayCheckIn, loading, addCheckIn, updateNotes } = useCheckIn()
    const { user } = useUser()
    const [mood, setMood] = useState("")
    const [showNotesInput, setShowNotesInput] = useState(false)
    const [notes, setNotes] = useState("")
    const isEvil = isEvilMode()

    if (loading) return null

    function handleSelect(value) {
        setMood(value)
        addCheckIn(value)
    }

    function handleSaveNotes() {
        if (!notes.trim()) return
        updateNotes(notes.trim())
        setShowNotesInput(false)
    }

    if (todayCheckIn) {
        return (
            <Card className="daily-check-in daily-check-in-done">
                <p className="daily-check-in-done-text">
                    {isEvil ? "Checked in. Fine." : `You checked in today. I'm glad you showed up, ${user.displayName}.`}
                </p>

                {todayCheckIn.notes ? (
                    <p className="daily-check-in-saved-notes">"{todayCheckIn.notes}"</p>
                ) : showNotesInput ? (
                    <div className="daily-check-in-note-form">
                        <Textarea 
                        label="Notes"
                        value={notes}
                        maxLength={MAX_NOTES_LENGTH}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={isEvil ? "Want to tell me something or not?" : "Tell me about your day..."}
                        />
                    
                        <p className="daily-check-in-char-count">{notes.length}/{MAX_NOTES_LENGTH}</p>
                        
                        <div className="daily-check-in-notes-actions">
                            <Button onClick={handleSaveNotes} disabled={!notes.trim()}>
                                Save
                            </Button>

                            <Button className="secondary" onClick={() => setShowNotesInput(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="daily-check-in-notes-toggle"
                        onClick={() => setShowNotesInput(true)}
                    >
                        Add notes (optional)
                    </button>
                )}
            </Card>
        )
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