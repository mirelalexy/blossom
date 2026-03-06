import GreetingHeader from "../components/navigation/home/GreetingHeader"
import StatsSection from "../components/navigation/home/StatsSection"

import "../styles/pages/Home.css"

function Home() {
    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader />

                <StatsSection />
            </div>
        </div>
    )
}

export default Home