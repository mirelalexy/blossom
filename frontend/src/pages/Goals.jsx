import { useState } from "react"
import AutosaveCard from "../components/goals/AutosaveCard"
import PageHeader from "../components/ui/PageHeader"
import SearchBar from "../components/ui/SearchBar"

import "../styles/pages/Goals.css"
import SavingGoalCard from "../components/goals/SavingGoalCard"

function Goals() {
    const [search, setSearch] = useState("") 
    
    const goals = [
        { id: 1, name: "Bali", target: 5000, saved: 2500 },
        { id: 2, name: "Emergency Fund", target: 10000, saved: 3000 }
    ]

    const filteredGoals = goals.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="saving-goals-layout">
            <div className="saving-goals-content">
                <PageHeader title="Saving Goals"></PageHeader>
                
                <SearchBar className="search-bar-icon" value={search} onChange={setSearch} />

                <AutosaveCard autosaveActive={true} primaryGoal="Bali" />

                {filteredGoals.map(g => (
                    <SavingGoalCard key={g.id} goal={g} />
                ))}
            </div>
        </div>
    )
}

export default Goals