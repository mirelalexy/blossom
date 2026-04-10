import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useGoals } from "../store/GoalsStore"
import { useBudget } from "../store/BudgetStore"

import AutosaveCard from "../components/goals/AutosaveCard"
import PageHeader from "../components/ui/PageHeader"
import SearchBar from "../components/ui/SearchBar"
import SavingGoalCard from "../components/goals/SavingGoalCard"
import Button from "../components/ui/Button"
import EmptyState from "../components/ui/EmptyState"

import "../styles/pages/Goals.css"

function Goals() {
    const navigate = useNavigate()
    const [search, setSearch] = useState("") 
    
    const { goals } = useGoals()
    const { budget } = useBudget()
    const isAutosaveActive = budget.rollover === "primaryGoal"
    
    const filteredGoals = goals.filter(g => g.name?.toLowerCase().includes(search.toLowerCase()))

    const primaryGoal = goals.find(g => g.is_primary)
    return (
        <div className="saving-goals-layout">
            <div className="saving-goals-content">
                <PageHeader title="Saving Goals"></PageHeader>
                
                <SearchBar className="search-bar-icon" value={search} onChange={setSearch} />

                {goals.length > 0 && (
                    <AutosaveCard
                        autosaveActive={isAutosaveActive}
                        primaryGoal={primaryGoal}
                        onAction={() => navigate("/settings/budget")}
                    />
                )}
                
                {filteredGoals.length === 0 ? (
                    <EmptyState 
                        title="No saving goals yet 🌸"
                        subtitle="Start saving for something meaningful."
                    />
                ) : (
                    filteredGoals.map(g => (
                        <SavingGoalCard key={g.id} goal={g} />
                    ))
                )}
                
                <Button onClick={() => navigate("/add-goal")}>Add Saving Goal</Button>
            </div>
        </div>
    )
}

export default Goals