import { useState, useMemo } from "react"

import { faq } from "../../data/faq"
import { isEvilMode, EVIL_FAQ } from "../../utils/evilBlossom"

import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

function FAQ() {
    const content = isEvilMode() ? EVIL_FAQ : faq

    const [openIndex, setOpenIndex] = useState(null)
    
    function handleToggle(index) {
        setOpenIndex(prev => prev === index ? null : index)
    }

    // group into sections
    const sections = useMemo(() => {
        const grouped = []
        const indexByCategory = {}

        content.forEach((item, i) => {
            const category = item.category

            if (!(category in indexByCategory)) {
                indexByCategory[category] = grouped.length
                grouped.push({ category, items: [] })
            }

            grouped[indexByCategory[category]].items.push({ ...item, globalIndex: i })
        })

        return grouped
    }, [content])

    return (
        <div className="page">
            <PageHeader title="FAQ" />

            <PageIntro
                title="Frequently Asked Questions"
                text="If something feels unclear, this should help."
            />

            {sections.map(section => (
                <Section key={section.category} title={section.category}>
                    <SettingsCard>
                        {section.items.map(item => (
                            <AccordionItem 
                                key={item.globalIndex} 
                                title={item.title} 
                                open={openIndex === item.globalIndex} 
                                onToggle={() => handleToggle(item.globalIndex)}>
                                    {item.content}
                            </AccordionItem>
                        ))}
                    </SettingsCard>
                </Section>
            ))}
        </div>
    )
}

export default FAQ