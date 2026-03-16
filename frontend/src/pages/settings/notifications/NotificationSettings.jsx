import { useNavigate } from "react-router-dom"

import { useNotifications } from "../../../store/NotificationStore"

import Section from "../../../components/ui/Section"
import PageHeader from "../../../components/ui/PageHeader"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import SettingsToggle from "../../../components/settings/SettingsToggle"

function Notifications() {
    const navigate = useNavigate()
    const { settings, updateSetting } = useNotifications()

    return (
        <div className="settings-content">
            <PageHeader title="Notifications" />

            <Section title="Budget">
                <SettingsCard>
                    <SettingsToggle
                        label="Notify me when I'm close to budget limit"
                        checked={settings.nearBudget}
                        onChange={(val) => updateSetting("nearBudget", val)}
                    />

                    <SettingsToggle
                        label="Notify me when I exceed my budget"
                        checked={settings.exceedBudget}
                        onChange={(val) => updateSetting("exceedBudget", val)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Growth & Journey">
                <SettingsCard>
                    <SettingsToggle
                        label="Notify me when I level up"
                        checked={settings.levelUp}
                        onChange={(val) => updateSetting("levelUp", val)}
                    />

                    <SettingsToggle
                        label="Notify me when I complete a challenge"
                        checked={settings.challengeComplete}
                        onChange={(val) => updateSetting("challengeComplete", val)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Reminders">
                <SettingsCard>
                    <SettingsToggle
                        label="Remind me to log transactions"
                        checked={settings.logReminder}
                        onChange={(val) => updateSetting("logReminder", val)}
                    />

                    <SettingsToggle
                        label="Remind me to review recurring payments"
                        checked={settings.recurringReminder}
                        onChange={(val) => updateSetting("recurringReminder", val)}
                    />

                    <SettingsItem 
                        label="Frequency"
                        value={settings.frequency}
                        onClick={() => navigate("/settings/notifications/frequency")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Notifications