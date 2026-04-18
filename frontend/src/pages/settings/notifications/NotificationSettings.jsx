import { useNavigate } from "react-router-dom"

import { useNotificationSettings } from "../../../store/NotificationSettingsStore"

import Section from "../../../components/ui/Section"
import PageHeader from "../../../components/ui/PageHeader"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import SettingsToggle from "../../../components/settings/SettingsToggle"

function NotificationSettings() {
    const navigate = useNavigate()
    const { notificationSettings: settings, updateNotificationSetting: updateSetting } = useNotificationSettings() 

    return (
        <div className="page">
            <PageHeader title="Notifications" />

            <Section title="Budget">
                <SettingsCard>
                    <SettingsToggle
                        label="Notify me when I'm close to budget limit"
                        checked={settings.near_budget}
                        onChange={(val) => updateSetting("near_budget", val)}
                    />

                    <SettingsToggle
                        label="Notify me when I exceed my budget"
                        checked={settings.exceed_budget}
                        onChange={(val) => updateSetting("exceed_budget", val)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Growth & Journey">
                <SettingsCard>
                    <SettingsToggle
                        label="Notify me when I level up"
                        checked={settings.level_up}
                        onChange={(val) => updateSetting("level_up", val)}
                    />

                    <SettingsToggle
                        label="Notify me when I complete a challenge"
                        checked={settings.challenge_complete}
                        onChange={(val) => updateSetting("challenge_complete", val)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Reminders">
                <SettingsCard>
                    <SettingsToggle
                        label="Remind me to log transactions"
                        checked={settings.log_reminder}
                        onChange={(val) => updateSetting("log_reminder", val)}
                    />

                    <SettingsToggle
                        label="Remind me to review recurring payments"
                        checked={settings.recurring_reminder}
                        onChange={(val) => updateSetting("recurring_reminder", val)}
                    />

                    <SettingsItem 
                        label="Review Recurring Payments Frequency"
                        value={settings.recurring_frequency}
                        onClick={() => navigate("/settings/notifications/frequency")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default NotificationSettings