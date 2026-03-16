import "../../styles/components/SettingsItem.css"
import Toggle from "../forms/Toggle"

function SettingsToggle({ label, checked, onChange }) {
    return (
        <div className="settings-item">
            <span className="settings-item-label">{label}</span>

            <Toggle
                checked={checked}
                onChange={onChange}
            />
        </div>
    )
}

export default SettingsToggle