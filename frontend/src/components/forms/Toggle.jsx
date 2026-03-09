import "../../styles/components/Toggle.css"

function Toggle({ label, checked, onChange }) {
    return (
        <div className="form-field toggle-field">
            <label>{label}</label>

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