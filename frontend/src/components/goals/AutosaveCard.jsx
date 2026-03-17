import Button from "../ui/Button"

import "../../styles/components/AutosaveCard.css"

function AutosaveCard({ autosaveActive, primaryGoal, onAction }) {
    return (
        <div className="autosave-card">
            <h3>{autosaveActive ? "Autosave Active" : "Autosave Disabled"}</h3>

            <p>{autosaveActive ? "Unused monthly budget is automatically added to your primary goal." : "Autosave is currently turned off."}</p>

            {autosaveActive && primaryGoal && (
                <p>Primary Goal: <strong>{primaryGoal.name}</strong></p>
            )}

            {autosaveActive && !primaryGoal && (
                <p>No primary goal selected.</p>
            )}
            
            <Button onClick={onAction}>Change</Button>
        </div>
    )
}

export default AutosaveCard