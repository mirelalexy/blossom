import { useTheme } from "../../store/ThemeStore"

import PageHeader from "../../components/ui/PageHeader"
import Section from "../../components/ui/Section"
import SettingsCard from "../../components/settings/SettingsCard"
import SettingsItem from "../../components/settings/SettingsItem"

const THEMES = [
    { id: "blossom", label: "Blossom", description: "Warm blush rose, the default" },
    { id: "petal", label: "Petal", description: "Soft lavender" },
    { id: "wildflower", label: "Wildflower", description: "Golden meadow warmth" },
    { id: "blossom-at-sea", label: "Blossom At Sea", description: "Soft coastal teal" },
    { id: "honeydew", label: "Honeydew", description: "Fresh spring green" },
    { id: "night", label: "Night", description: "Deep charcoal with violet" },
    { id: "caramel", label: "Caramel", description: "Sugar overload" },
    { id: "evil-blossom", label: "Evil Blossom", description: "I get a little... different in the dark" }
]

function ThemeSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="page">
            <PageHeader title="Theme" />

            <Section title="Customize how Blossom looks and feels">
                <SettingsCard>
                    {THEMES.map(t => (
                        <SettingsItem
                            key={t.id}
                            label={t.label}
                            value={theme === t.id ? "Current" : t.description}
                            onClick={() => setTheme(t.id)}
                        />
                    ))}
                </SettingsCard>
            </Section>

            {theme === "evil-blossom" && (
                <p className="secondary-text" style={{ textAlign: "center", fontSize: 13, fontStyle: "italic" }}>
                    You chose this. I'm not complaining.
                </p>
            )}
        </div>
    )
}

export default ThemeSettings