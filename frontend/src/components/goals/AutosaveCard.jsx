import Button from "../ui/Button"

import "../../styles/components/AutosaveCard.css"

function AutosaveCard({ autosaveActive, primaryGoal }) {
    return (
        <div className="autosave-card">
            <h3>{autosaveActive ? "Autosave Active" : "Autosave Disabled"}</h3>

            <p>{autosaveActive ? "Unused monthly budget is automatically added to your primary goal." : "Autosave is currently turned off."}</p>

            {autosaveActive && (
                <p>Primary Goal: <strong>{primaryGoal}</strong></p>
            )}
            
            <Button>{autosaveActive ? "Change" : "Enable"}</Button>
        </div>
    )
}

export default AutosaveCard