import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGoals } from "../store/GoalsStore"

import AutosaveCard from "../components/goals/AutosaveCard"
import PageHeader from "../components/ui/PageHeader"
import SearchBar from "../components/ui/SearchBar"
import SavingGoalCard from "../components/goals/SavingGoalCard"
import Button from "../components/ui/Button"

import "../styles/pages/Goals.css"

function Goals() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("") 
    
    const { goals } = useGoals()
    
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

                <Button onClick={() => navigate("/add-goal")}>Add Saving Goal</Button>
            </div>
        </div>
    )
}

export default Goals