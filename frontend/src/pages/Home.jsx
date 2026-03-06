import GreetingHeader from "../components/navigation/home/GreetingHeader"

import "./Home.css"

function Home() {
    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader />
            </div>
        </div>
    )
}

export default Home