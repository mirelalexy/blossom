import { useNavigate } from "react-router-dom"

import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"
import SettingsCard from "../components/settings/SettingsCard"
import SettingsItem from "../components/settings/SettingsItem"

import "../styles/pages/Settings.css"

function Settings() {
    const navigate = useNavigate()

    return (
        <div className="settings-content">
            <PageHeader title="Settings" />

            <Section title="Account Settings">
                <SettingsCard>
                    <SettingsItem 
                        icon="account"
                        label="Account"
                        onClick={() => navigate("/settings/account")}
                    />

                    <SettingsItem 
                        icon="dataPrivacy"
                        label="Data & Privacy"
                        onClick={() => navigate("/settings/data-and-privacy")}
                    />
                </SettingsCard>
            </Section>

            <Section title="App Settings">
                <SettingsCard>
                    <SettingsItem 
                        icon="theme"
                        label="Theme"
                        onClick={() => navigate("/settings/theme")}
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
                        onClick={() => navigate("/settings/currency")}
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
                        onClick={() => navigate("/settings/app-tips")}
                    />

                    <SettingsItem 
                        icon="faq"
                        label="FAQ"
                        onClick={() => navigate("/settings/faq")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Settings