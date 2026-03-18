import "../../styles/components/Toggle.css"

function Toggle({ label, checked = false, onChange }) {
    return (
        <div className="toggle-field">
            {label && <label className="input-label">{label}</label>}

            <button
                type="button"
                className={`toggle ${checked ? "active" : ""}`}    
                onClick={() => onChange(!checked)}
            >
                <div className="toggle-thumb"></div>
            </button>
        </div>
    )
}

export default Toggle