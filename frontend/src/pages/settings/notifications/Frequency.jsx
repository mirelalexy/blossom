import { useNotificationSettings } from "../../../store/NotificationSettingsStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"

function Frequency() {
    const { notificationSettings: settings, updateNotificationSetting } = useNotificationSettings()

    return (
        <div className="page">
            <PageHeader title="Frequency" />

            <Section title="How often should Blossom remind you to review recurring payments?">
                <SettingsCard>
                    <SettingsItem 
                        label={`Weekly ${settings.recurring_frequency === "weekly" ? "(current)" : ""}`}
                        onClick={() => updateNotificationSetting("recurring_frequency", "weekly")}
                    />

                    <SettingsItem 
                        label={`Monthly ${settings.recurring_frequency === "monthly" ? "(current)" : ""}`}
                        onClick={() => updateNotificationSetting("recurring_frequency", "monthly")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Frequency