import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import RadioGroup from "../../../components/forms/RadioGroup"

function Categories() {
    const navigate = useNavigate()
    const { categories, addCategory, deleteCategory } = useCategories()
    const [ newCategory, setNewCategory] = useState("")
    const [ type, setType ] = useState("expense")

    function sortCategories(list) {
        return [...list]
            .filter(cat => !cat.id.includes("other"))
            .sort((a, b) => a.name.localeCompare(b.name))
        
    }

    const expenseCategories = sortCategories(
        categories.filter(cat => cat.type === "expense")
    )

    const incomeCategories = sortCategories(
        categories.filter(cat => cat.type === "income")
    )

    function handleAdd() {
        addCategory(newCategory, type)
        setNewCategory("")
    }

    return (
        <div className="settings-content">
            <PageHeader title="Categories" />

            <Section title="Add Category">
                <Input 
                    placeholder="New category name"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />

                <RadioGroup
                    label="Type"
                    name="type"
                    value={type}
                    onChange={(val) => setType(val)}
                    options={[
                        { value: "expense", label: "Expense" },
                        { value: "income", label: "Income" }
                    ]}
                    />

                <Button 
                    onClick={handleAdd} 
                    disabled={!newCategory.trim()}
                >
                    Add Category
                </Button>
            </Section>

            <Section title="Your Expense Categories">
                <SettingsCard>
                    {expenseCategories.map(cat => (
                        <SettingsItem 
                            key={cat.id}
                            label={cat.name}
                            icon={cat.icon}
                        />
                    ))}
                </SettingsCard>
            </Section>

            <Section title="Your Income Categories">
                <SettingsCard>
                    {incomeCategories.map(cat => (
                        <SettingsItem 
                            key={cat.id}
                            label={cat.name}
                            icon={cat.icon}
                        />
                    ))}
                </SettingsCard>
            </Section>
        </div>
    )
}

export default Categories