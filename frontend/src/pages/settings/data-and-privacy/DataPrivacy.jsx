import { useNavigate } from "react-router-dom"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"

function DataPrivacy() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <PageHeader title="Data & Privacy" />

            <Section title="About You">
                <SettingsCard>
                    <SettingsItem 
                        label="Your Bio"
                        onClick={() => navigate("/settings/data-and-privacy/bio")}
                    />
                </SettingsCard>
            </Section>

            <Section title="Control Your Data">
                <SettingsCard>
                    <SettingsItem 
                        label="Export Data"
                        onClick={() => navigate("/settings/data-and-privacy/export")}
                    />

                    <SettingsItem 
                        label="Reset App (Clear Data)"
                        onClick={() => navigate("/settings/data-and-privacy/reset")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default DataPrivacy