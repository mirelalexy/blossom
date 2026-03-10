import AutosaveCard from "../components/goals/AutosaveCard"
import Button from "../components/ui/Button"
import PageHeader from "../components/ui/PageHeader"
import SearchBar from "../components/ui/SearchBar"

import "../styles/pages/Goals.css"

function Goals() {
    return (
        <div className="saving-goals-layout">
            <div className="saving-goals-content">
                <PageHeader title="Saving Goals"></PageHeader>
                
                <SearchBar className="search-bar-icon"/>

                <AutosaveCard autosaveActive={true} primaryGoal="Bali"/>
            </div>
        </div>
    )
}

export default Goals