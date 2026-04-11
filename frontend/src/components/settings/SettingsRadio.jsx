import "../../styles/components/SettingsRadio.css"

function SettingsRadio({ label, name, value, checkedValue, onChange }) {
    return (
        <div className="settings-item" onClick={() => onChange(value)}>
            <div className="settings-item-left">
                <span className="settings-item-label">{label}</span>
            </div>

            <div className="settings-item-right settings-radio">
                <input 
                    type="radio" 
                    name={name} 
                    value={value} 
                    checked={checkedValue === value} 
                    onChange={() => onChange(value)}
                />
            </div>
        </div>
    )}

export default SettingsRadio