import { useNavigate } from "react-router-dom"

import { useUser } from "../store/UserStore"

import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"
import SettingsCard from "../components/settings/SettingsCard"
import SettingsItem from "../components/settings/SettingsItem"

import "../styles/pages/Settings.css"

function Settings() {
    const navigate = useNavigate()
    const { logout } = useUser()

    function handleLogout() {
        logout()
        navigate("/login")
    }

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
                        onClick={() => navigate("/settings/notifications")}
                    />

                    <SettingsItem 
                        icon="monthlyBudget"
                        label="Monthly Budget"
                        onClick={() => navigate("/settings/budget")}
                    />

                    <SettingsItem 
                        icon="categories"
                        label="Categories"
                        onClick={() => navigate("/settings/categories")}
                    />

                    <SettingsItem 
                        icon="currency"
                        label="Currency"
                        onClick={() => navigate("/settings/currency")}
                    />

                    <SettingsItem 
                        icon="customSpendingRules"
                        label="Custom Spending Rules"
                        onClick={() => navigate("/settings/rules")}
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
                    <SettingsItem 
                        icon="privacyPolicy"
                        label="Privacy Policy"
                        onClick={() => navigate("/settings/privacy-policy")}
                    />
                </SettingsCard>
            </Section>

            <Section>
                <SettingsCard>
                    <SettingsItem 
                        icon="logOut"
                        label="Log Out"
                        onClick={handleLogout}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Settings