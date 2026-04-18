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
        target_amount: "",
        deadline: today,
        notes: "",
        link: "",
        is_primary: false,
        saving_mode: "auto"
    })

    function handleChange(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function calculateMonthlyContribution(goal) {
        if (!goal.target_amount || !goal.deadline) return 0

        const start = new Date()
        const end = new Date(goal.deadline)

        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

        if (months <= 0) return goal.target_amount

        return Math.ceil(goal.target_amount / months)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newGoal = {
            name: formData.name,
            target_amount: Number(formData.target_amount),
            deadline: formData.deadline,
            monthlyContribution: formData.monthlyContribution,
            notes: formData.notes,
            link: formData.link,
            is_primary: formData.is_primary,
            saving_mode: formData.saving_mode
        }

        addGoal(newGoal)

        navigate("/goals")
    }

    return (
        <div className="page">
            <PageHeader title="Add Saving Goal" />

            <form className="form" onSubmit={handleSubmit}>
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
                    value={formData.target_amount}
                    onChange={(e) => handleChange("target_amount", e.target.value)}
                />

                {/* Date */}
                <Input 
                    label="Deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                />

                {/* Monthly Contribution */}
                <div className="saving-mode">
                    <RadioGroup
                        label="Saving Mode"
                        name="saving_mode"
                        value={formData.saving_mode}
                        onChange={(val) => handleChange("saving_mode", val)}
                        options={[
                            { value: "auto", label: "Let Blossom calculate for me" },
                            { value: "manual", label: "I'll decide manually" }
                        ]}
                    />

                    {formData.saving_mode === "auto" && formData.target_amount && formData.deadline && (
                        <p>To reach {formatCurrency(formData.target_amount, currency)}, you'll need to save {formatCurrency(calculateMonthlyContribution(formData), currency)}/month.</p>
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
                    checked={formData.is_primary}
                    onChange={(val) => handleChange("is_primary", val)}    
                />

                <Button type="submit">Plant New Goal</Button>
            </form>
        </div>
    )
}

export default AddSavingGoal