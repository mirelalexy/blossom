import "../../styles/components/SettingsCard.css"

function SettingsCard({ children }) {
    return (
        <div className="settings-card">
            {children}
        </div>
    )
}

export default SettingsCard