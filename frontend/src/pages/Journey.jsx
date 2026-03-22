import PageHeader from "../components/ui/PageHeader"
import NotificationItem from "../components/notifications/NotificationItem"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"

import "../styles/pages/Journey.css"

function Journey() {

    return (
        <div className="journey-content">
            <PageHeader title="Journey" />
            
            <Section title="Your Journey So Far">

            </Section>
            
            <Section title="Your Patterns">

            </Section>

            <Section title="Statistics">

            </Section>

            <Section title="Insights">

            </Section>
        </div>
    )
}

export default Journey