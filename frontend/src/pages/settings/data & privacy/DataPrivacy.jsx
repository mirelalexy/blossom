import { useNavigate } from "react-router-dom"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"

function DataPrivacy() {
    const navigate = useNavigate()

    return (
        <div className="settings-content">
            <PageHeader title="Data & Privacy" />

            <Section>
                <SettingsCard>
                    <SettingsItem 
                        label="Export Data"
                    />
                </SettingsCard>
            </Section>

            <Section>
                <SettingsCard>
                    <SettingsItem 
                        label="Reset App (Clear Data)"
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default DataPrivacy