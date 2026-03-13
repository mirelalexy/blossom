import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

import { appTips } from "../../data/appTips"

function AppTips() {
    return (
        <div className="settings-content">
            <PageHeader title="App Tips" />

            <PageIntro
                title="App tips to help you out"
                text="Small habits that make a big difference."
            />

            <Section>
                <SettingsCard>
                    {appTips.map((tip, index) => (
                        <AccordionItem key={index} title={tip.title}>
                            {tip.content}
                        </AccordionItem>
                    ))}
                </SettingsCard>
            </Section>
        </div>
    )
}

export default AppTips