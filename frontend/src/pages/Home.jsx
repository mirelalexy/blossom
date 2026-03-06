import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import Section from "../components/ui/Section"

import "../styles/pages/Home.css"

function Home() {
    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader />

                <Section title="Stats">
                    <PrimaryGoalCard />
                    <TopCategoryCard />
                </Section>
            </div>
        </div>
    )
}

export default Home