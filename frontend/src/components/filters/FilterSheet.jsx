import Select from "../forms/Select"
import RadioGroup from "../forms/RadioGroup"
import Button from "../ui/Button"

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

                <div className="filter-actions">
                    <Button onClick={onClose}>Apply</Button>
                </div>
            </div>
        </>
    )
}

export default FilterSheet