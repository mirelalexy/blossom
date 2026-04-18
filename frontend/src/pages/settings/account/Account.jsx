import { useNavigate } from "react-router-dom"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"

function Account() {
    const navigate = useNavigate()
    const { user } = useUser()

    return (
        <div className="page">
            <PageHeader title="Account" />

            <Section title="Account Settings">
                <SettingsCard>
                    <SettingsItem 
                        label="Display Name"
                        value={user.displayName}
                        onClick={() => navigate("/settings/account/display-name")}
                    />

                    <SettingsItem 
                        label="Email"
                        value={user.email}
                        onClick={() => navigate("/settings/account/email")}
                    />
                </SettingsCard>
            </Section>

            <Section title="Login Methods">
                <SettingsCard>
                    <SettingsItem 
                        label="Password"
                        onClick={() => navigate("/settings/account/password")}
                    />
                </SettingsCard>
            </Section>

            <Section title="Account Management">
                <SettingsCard>
                    <SettingsItem 
                        label="Delete Account"
                        onClick={() => navigate("/settings/account/delete")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Account