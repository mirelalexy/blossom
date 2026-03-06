import GreetingHeader from "../components/home/GreetingHeader"
import StatsSection from "../components/home/StatsSection"

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