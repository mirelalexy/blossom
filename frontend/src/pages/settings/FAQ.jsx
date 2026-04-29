import { useState } from "react"

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

    return (
        <div className="page">
            <PageHeader title="FAQ" />

            <PageIntro
                title="Frequently Asked Questions"
                text="Answers to common questions about Blossom."
            />

            <Section>
                <SettingsCard>
                    {content.map((question, index) => (
                        <AccordionItem key={index} title={question.title} open={openIndex === index} onToggle={() => handleToggle(index)}>
                            {question.content}
                        </AccordionItem>
                    ))}
                </SettingsCard>
            </Section>
        </div>
    )
}

export default FAQ