import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useGoals } from "../store/GoalsStore"
import { useCurrency } from "../store/CurrencyStore"

import { formatCurrency } from "../utils/currencyUtils"

import PageHeader from "../components/ui/PageHeader"
import Input from "../components/forms/Input"
import RadioGroup from "../components/forms/RadioGroup"
import Textarea from "../components/forms/Textarea"
import Toggle from "../components/forms/Toggle"
import Button from "../components/ui/Button"

import "../styles/pages/AddSavingGoal.css"

function AddSavingGoal() {
    const navigate = useNavigate()

    const { addGoal } = useGoals()
    const { currency } = useCurrency()

    const today = new Date().toISOString().split("T")[0]

    const [formData, setFormData] = useState({
        name: "",
        target: "",
        date: today,
        monthlyContribution: "automatic",
        notes: "",
        link: "",
        primaryGoal: false,
    })

    function handleChange(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function calculateMonthlyContribution(goal) {
        if (!goal.target || !goal.date) return 0

        const start = new Date()
        const end = new Date(goal.date)

        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

        if (months <= 0) return goal.target

        return Math.ceil(goal.target / months)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newGoal = {
            id: Date.now(),
            name: formData.name,
            target: Number(formData.target),
            date: formData.date,
            monthlyContribution: formData.monthlyContribution,
            notes: formData.notes,
            link: formData.link,
            primaryGoal: formData.primaryGoal,
            saved: 0
        }

        addGoal(newGoal)

        navigate("/goals")
    }

    return (
        <div className="add-goal-layout">
            <div className="add-goal-content">
                <PageHeader title="Add Saving Goal"></PageHeader>

                <form className="add-goal-form" onSubmit={handleSubmit}>
                    {/* Name */}
                    <Input 
                        label="Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />

                    {/* Target */}
                    <Input 
                        label="Target"
                        type="number"
                        placeholder="0"
                        value={formData.target}
                        onChange={(e) => handleChange("target", e.target.value)}
                    />

                    {/* Date */}
                    <Input 
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                    />

                    {/* Monthly Contribution */}
                    <div className="monthly-contribution">
                        <RadioGroup
                            label="Monthly Contribution"
                            name="monthlyContribution"
                            value={formData.monthlyContribution}
                            onChange={(val) => handleChange("monthlyContribution", val)}
                            options={[
                                { value: "automatic", label: "Let Blossom calculate for me" },
                                { value: "manual", label: "I'll decide manually" }
                            ]}
                        />

                        {formData.monthlyContribution === "automatic" && formData.target && formData.date && (
                            <p>To reach {formatCurrency(formData.target, currency)}, you'll need to save {formatCurrency(calculateMonthlyContribution(formData), currency)}/month.</p>
                        )}
                    </div>
                    
                    {/* Notes */}
                    <Textarea 
                        label="Notes"
                        placeholder="Add a note (optional)"
                        maxlength={200}
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                    />

                    {/* Link */}
                    <Input 
                        label="Link"
                        type="url"
                        value={formData.link}
                        onChange={(e) => handleChange("link", e.target.value)}
                    />

                    {/* Primary Goal */}
                    <Toggle
                        label="Primary Goal"
                        checked={formData.primaryGoal}
                        onChange={(val) => handleChange("primaryGoal", val)}    
                    />

                    <Button type="submit">Plant New Goal</Button>
                </form>
            </div>
        </div>
    )
}

export default AddSavingGoal