import { useState, useMemo } from "react"

import { appTips } from "../../data/appTips"
import { EVIL_APP_TIPS, isEvilMode } from "../../utils/evilBlossom"

import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

function AppTips() {
    const tips = isEvilMode() ? EVIL_APP_TIPS : appTips

    const [openIndex, setOpenIndex] = useState(null)

    function handleToggle(index) {
        setOpenIndex(prev => prev === index ? null : index)
    }

    // group into sections
    const sections = useMemo(() => {
        const grouped = []
        const indexByCategory = {}

        tips.forEach((tip, i) => {
            const category = tip.category

            if (!(category in indexByCategory)) {
                indexByCategory[category] = grouped.length
                grouped.push({ category, items: [] })
            }

            grouped[indexByCategory[category]].items.push({ ...tip, globalIndex: i })
        })

        return grouped
    }, [tips])

    return (
        <div className="page">
            <PageHeader title="App Tips" />

            <PageIntro
                title="App tips to help you out"
                text="Small habits that make a big difference."
            />

            {sections.map(section => (
                <Section key={section.category} title={section.category}>
                    <SettingsCard>
                        {section.items.map(tip => (
                            <AccordionItem 
                                key={tip.globalIndex} 
                                title={tip.title} 
                                open={openIndex === tip.globalIndex} 
                                onToggle={() => handleToggle(tip.globalIndex)}>
                                    {tip.content}
                            </AccordionItem>
                        ))}
                    </SettingsCard>
                </Section>
            ))}
        </div>
    )
}

export default AppTips