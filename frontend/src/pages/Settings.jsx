import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"
import SettingsCard from "../components/settings/SettingsCard"
import SettingsItem from "../components/settings/SettingsItem"

import "../styles/pages/Settings.css"

function Settings() {
    return (
        <div className="settings-content">
            <PageHeader title="Settings" />

            <Section title="Account Settings">
                <SettingsCard>
                    <SettingsItem 
                        icon="account"
                        label="Account"
                    />

                    <SettingsItem 
                        icon="dataPrivacy"
                        label="Data & Privacy"
                    />
                </SettingsCard>
            </Section>

            <Section title="App Settings">
                <SettingsCard>
                    <SettingsItem 
                        icon="theme"
                        label="Theme"
                    />

                    <SettingsItem 
                        icon="notifications"
                        label="Notifications"
                    />

                    <SettingsItem 
                        icon="monthlyBudget"
                        label="Monthly Budget"
                    />

                    <SettingsItem 
                        icon="currency"
                        label="Currency"
                    />

                    <SettingsItem 
                        icon="customSpendingRules"
                        label="Custom Spending Rules"
                    />
                </SettingsCard>
            </Section>

            <Section title="Support">
                <SettingsCard>
                    <SettingsItem 
                        icon="appTips"
                        label="App Tips"
                    />

                    <SettingsItem 
                        icon="faq"
                        label="FAQ"
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Settings