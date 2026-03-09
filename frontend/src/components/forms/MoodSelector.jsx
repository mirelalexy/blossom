const moods = [
    { value: "happy", emoji: "🤩" },
    { value: "calm", emoji: "😌" },
    { value: "anxious", emoji: "😰" },
    { value: "neutral", emoji: "😐" },
    { value: "sad", emoji: "☹️" }
]

function MoodSelector({ label, value, onChange }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <div className="mood-selector">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        type="button"
                        className={`mood-btn ${value === mood.value ? "selected" : ""}`}
                        onClick={() => onChange(mood.value)}
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MoodSelector