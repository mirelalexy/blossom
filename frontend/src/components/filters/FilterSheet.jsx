import Select from "../forms/Select"
import RadioGroup from "../forms/RadioGroup"
import Button from "../ui/Button"
import Input from "../forms/Input"

import "../../styles/components/FilterSheet.css"

function FilterSheet({ filters, updateFilter, onClose }) {
    return (
        <>
            <div className="filter-overlay" onClick={onClose}></div>

            <div className="filter-sheet">
                <div className="filter-handle"></div>

                <h2>Filters</h2>

                <Select 
                    label="Category"
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    options={[
                        { value: "", label: "All categories" },
                        { value: "Food", label: "Food" },
                        { value: "Gaming", label: "Gaming" },
                        { value: "Coffee", label: "Coffee" },
                        { value: "Entertainment", label: "Entertainment" },
                        { value: "Pets", label: "Pets" },
                        { value: "Clothing", label: "Clothing" }
                    ]}
                />

                <RadioGroup 
                    label="Type"
                    value={filters.type}
                    onChange={(val) => updateFilter("type", val)}
                    options={[
                        { value: "", label: "All" },
                        { value: "Expense", label: "Expense" },
                        { value: "Income", label: "Income" }
                    ]}
                />

                <RadioGroup 
                    label="Intent"
                    value={filters.intent}
                    onChange={(val) => updateFilter("intent", val)}
                    options={[
                        { value: "", label: "All" },
                        { value: "Necessary", label: "Necessary" },
                        { value: "Planned", label: "Planned" },
                        { value: "Impulse", label: "Impulse" }
                    ]}
                />

                <Select 
                    label="Mood"
                    value={filters.mood}
                    onChange={(e) => updateFilter("mood", e.target.value)}
                    options={[
                        { value: "", label: "Any mood" },
                        { value: "happy", label: "Happy" },
                        { value: "calm", label: "Calm" },
                        { value: "neutral", label: "Neutral" },
                        { value: "anxious", label: "Anxious" },
                        { value: "sad", label: "Sad" }
                    ]}
                />

                <Input 
                    label="From"
                    type="date"
                    value={filters.period.start}
                    onChange={(e) => updateFilter("period", {
                        ...filters.period,
                        start: e.target.value
                    })}
                />

                <Input 
                    label="To"
                    type="date"
                    value={filters.period.end}
                    onChange={(e) => updateFilter("period", {
                        ...filters.period,
                        end: e.target.value
                    })}
                />

                <div className="filter-actions">
                    <Button onClick={onClose}>Apply</Button>
                </div>
            </div>
        </>
    )
}

export default FilterSheet