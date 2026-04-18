import { useTheme } from "../../store/ThemeStore"

import PageHeader from "../../components/ui/PageHeader"
import Section from "../../components/ui/Section"
import SettingsCard from "../../components/settings/SettingsCard"
import SettingsItem from "../../components/settings/SettingsItem"

function ThemeSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="page">
            <PageHeader title="Theme" />

            <Section title="Customize how Blossom looks and feels">
                <SettingsCard>
                    <SettingsItem 
                        label={`Blossom ${theme === "blossom" ? "(current)" : ""}`}
                        onClick={() => setTheme("blossom")}
                    />

                    <SettingsItem 
                        label={`Petal ${theme === "petal" ? "(current)" : ""}`}
                        onClick={() => setTheme("petal")}
                    />

                    <SettingsItem 
                        label={`Dusk ${theme === "dusk" ? "(current)" : ""}`}
                        onClick={() => setTheme("dusk")}
                    />

                    <SettingsItem 
                        label={`Forest ${theme === "forest" ? "(current)" : ""}`}
                        onClick={() => setTheme("forest")}
                    />

                    <SettingsItem 
                        label={`Night ${theme === "night" ? "(current)" : ""}`}
                        onClick={() => setTheme("night")}
                    />

                    <SettingsItem 
                        label={`Velvet Rose ${theme === "velvet-rose" ? "(current)" : ""}`}
                        onClick={() => setTheme("velvet-rose")}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default ThemeSettings