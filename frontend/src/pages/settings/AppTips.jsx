import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import AccordionItem from "../../components/ui/AccordionItem"
import SettingsCard from "../../components/settings/SettingsCard"
import Section from "../../components/ui/Section"

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
                    <AccordionItem title="Log consistently">
                        Logging every expense — even small ones — builds awareness.
                        Consistency matters more than perfection.
                    </AccordionItem>
                    <AccordionItem title="Use guidelines gently">
                        Spending limits are guides, not punishments.
                        If you occassionally go over, treat it as feedback, not failure.
                    </AccordionItem>
                    <AccordionItem title="Review weekly">
                        Take a few minutes each week to review your spending.
                        Patterns become easier to spot when you pause and reflect.
                    </AccordionItem>
                    <AccordionItem title="Adjust when needed">
                        Your budget should evolve with your life.
                        If something stops working, adjust it instead of abandoning it.
                    </AccordionItem>
                    <AccordionItem title="Small purchases add up">
                        Small expenses are easy to overlook.
                        Tracking them helps reveal patterns you might otherwise miss.
                    </AccordionItem>
                    <AccordionItem title="Categorize thoughtfully">
                        Categories help you understand where your money goes.
                        Choose ones that reflect your real habits.
                    </AccordionItem>
                    <AccordionItem title="New to budgeting?">
                        Start small. Focus on awareness first.
                        Better habits grow naturally once you understand your spending.
                    </AccordionItem>
                </SettingsCard>
            </Section>
        </div>
    )
}

export default AppTips