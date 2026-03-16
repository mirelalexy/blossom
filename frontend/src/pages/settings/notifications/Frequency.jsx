import { useNotifications } from "../../../store/NotificationStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"

function Frequency() {
    const { settings, updateSetting } = useNotifications()

    return (
        <div className="settings-content">
            <PageHeader title="Frequency" />

            <Section title="Customize how often Blossom sends you reminders">
                <SettingsCard>
                    <SettingsItem 
                        label={`Daily ${settings.frequency === "daily" ? "(current)" : ""}`}
                        onClick={() => updateSetting("frequency", "daily")}
                    />

                    <SettingsItem 
                        label={`Weekly ${settings.frequency === "weekly" ? "(current)" : ""}`}
                        onClick={() => updateSetting("frequency", "weekly")}
                    />

                    <SettingsItem 
                        label={`Monthly ${settings.frequency === "monthly" ? "(current)" : ""}`}
                        onClick={() => updateSetting("frequency", "monthly")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Frequency