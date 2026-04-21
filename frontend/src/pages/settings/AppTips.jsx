import { useState } from "react"

import { appTips } from "../../data/appTips"

import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

function AppTips() {
    const [openIndex, setOpenIndex] = useState(null)

    function handleToggle(index) {
        setOpenIndex(prev => prev === index ? null : index)
    }

    return (
        <div className="page">
            <PageHeader title="App Tips" />

            <PageIntro
                title="App tips to help you out"
                text="Small habits that make a big difference."
            />

            <Section>
                <SettingsCard>
                    {appTips.map((tip, index) => (
                        <AccordionItem key={index} title={tip.title} open={openIndex === index} onToggle={() => handleToggle(index)}>
                            {tip.content}
                        </AccordionItem>
                    ))}
                </SettingsCard>
            </Section>
        </div>
    )
}

export default AppTips