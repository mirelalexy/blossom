import Icon from "../ui/Icon"

import "../../styles/components/SettingsItem.css"

function SettingsItem({ icon, label, value, onClick }) {
    return (
        <div className="settings-item" onClick={onClick}>
            <div className="settings-item-left">
                {icon && <Icon name={icon} />}
                <span className="settings-item-label">{label}</span>
            </div>

            <div className="settings-item-right">
                {value && (
                    <span className="settings-item-value">{value}</span>
                )}
                <Icon name="seeDetails" size={18} />
            </div>
        </div>
    )
}

export default SettingsItem