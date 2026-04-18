import { faq } from "../../data/faq"

import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

function FAQ() {
    return (
        <div className="page">
            <PageHeader title="FAQ" />

            <PageIntro
                title="Frequently Asked Questions"
                text="Answers to common questions about Blossom."
            />

            <Section>
                <SettingsCard>
                    {faq.map((tip, index) => (
                        <AccordionItem key={index} title={tip.title}>
                            {tip.content}
                        </AccordionItem>
                    ))}
                </SettingsCard>
            </Section>
        </div>
    )
}

export default FAQ