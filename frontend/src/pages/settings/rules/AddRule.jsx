import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useCategories } from "../../../store/CategoryStore"
import { useRules } from "../../../store/RuleStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import Section from "../../../components/ui/Section"
import Select from "../../../components/forms/Select"
import RadioGroup from "../../../components/forms/RadioGroup"

function AddRule() {
    const navigate = useNavigate()
    const { rules, addRule } = useRules()
    const { categories } = useCategories()

    const [categoryId, setCategoryId] = useState("")
    const [type, setType] = useState("single_limit")
    const [value, setValue] = useState("")

    const [error, setError] = useState("")

    function handleSave() {
        if (!categoryId) {
            setError("Please select a category.")
            return
        }

        if (!value || Number(value) <= 0) {
            setError("Enter a valid value.")
            return
        }

        const exists = rules.some(
            r => r.category_id === categoryId && r.type === type
        )

        if (exists) {
            setError("Rule of this type already exists for this category.")
            return
        }

        addRule({
            category_id: categoryId,
            type,
            value: Number(value)
        })

        navigate(-1)
    }

    return (
        <div className="page">
            <PageHeader title="Add Spending Rule" />

            <Section>
                <Select
                    label="Category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    options={[
                        { value: "", label: "Select category" },
                        ...categories
                            .filter(c => c.type === "expense" && !c.id.includes("other"))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(c => ({
                                value: c.id,
                                label: c.name
                            }))
                    ]}
                />

                <RadioGroup
                    label="Rule Type"
                    value={type}
                    onChange={(val) => setType(val)}
                    options={[
                        { value: "single_limit", label: "Single transaction limit"},
                        { value: "weekly_count", label: "Weekly transaction limit"},
                    ]}
                />

                <Input 
                    label={
                        type === "single_limit" ? "Max Amount" : "Max Transactions Per Week"
                    }
                    type="number"
                    min={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Section>

            {error && <p className="error-text">{error}</p>}

            <Button 
                onClick={handleSave}
                disabled={!categoryId || !value}
            >
                Save
            </Button>
        </div>
    )
}

export default AddRule