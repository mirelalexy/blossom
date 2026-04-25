import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useGoals } from "../store/GoalsStore"
import { useCurrency } from "../store/CurrencyStore"

import { formatCurrency } from "../utils/currencyUtils"
import { parseLocalDate } from "../utils/dateUtils"

import PageHeader from "../components/ui/PageHeader"
import Input from "../components/forms/Input"
import RadioGroup from "../components/forms/RadioGroup"
import Textarea from "../components/forms/Textarea"
import Toggle from "../components/forms/Toggle"
import Button from "../components/ui/Button"
import Section from "../components/ui/Section"

function EditSavingGoal() {
    const navigate = useNavigate()
    
    const { id } = useParams()
    const { goals, updateGoal } = useGoals()
    const { currency } = useCurrency()

    const goal = goals.find(g => g.id === id)

    const [formData, setFormData] = useState(null)

    useEffect(() => {
        if (!goal) return
        setFormData({
            name: goal.name || "",
            target_amount: goal.target_amount || "",
            deadline: goal.deadline || "",
            notes: goal.notes || "",
            link: goal.link || "",
            is_primary: goal.is_primary || false,
            saving_mode: goal.saving_mode || "manual"
        })
    }, [goal])

    if (!goal || !formData) {
        return (
            <div className="page">
                <PageHeader title="Edit Goal" />
                <p className="secondary-text" style={{ padding: "24px", textAlign: "center" }}>
                    Goal not found.
                </p>
            </div>
        )
    }

    function handleChange(field, value) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    function calculateMonthly() {
        const { target_amount, deadline } = formData
        const remaining = Number(target_amount) - Number(goal.current_amount)
        if (remaining <= 0 || !deadline) return 0

        const now  = new Date()
        const end = parseLocalDate(deadline)
        const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth())

        if (months <= 0) return remaining
        return Math.ceil(remaining / months)
    }

    async function handleSave(e) {
        e.preventDefault()

        await updateGoal({
            ...goal,
            name: formData.name.trim(),
            target_amount: Number(formData.target_amount),
            deadline: formData.deadline || null,
            notes: formData.notes,
            link: formData.link,
            is_primary: formData.is_primary,
            saving_mode: formData.saving_mode,
            // pass these but do not change
            current_amount: goal.current_amount,
            is_completed: goal.is_completed
        })

        navigate("/goals")
    }

    const monthly = calculateMonthly()
    const canSave = formData.name.trim() && Number(formData.target_amount) > 0

    return (
        <div className="page">
            <PageHeader title="Edit Goal" />

            <form className="form" onSubmit={handleSave}>
                <Section title="Goal details">
                    <Input
                        label="Name"
                        type="text"
                        value={formData.name}
                        onChange={e => handleChange("name", e.target.value)}
                        required
                    />

                    <Input
                        label="Target Amount"
                        type="number"
                        min={goal.current_amount || 1}
                        value={formData.target_amount}
                        onChange={e => handleChange("target_amount", e.target.value)}
                        required
                    />

                    {Number(formData.target_amount) < goal.current_amount && (
                        <p className="error-text">
                            Target can't be less than what's already saved ({formatCurrency(goal.current_amount, currency)}).
                        </p>
                    )}

                    <Input
                        label="Deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={e => handleChange("deadline", e.target.value)}
                    />
                </Section>

                <Section title="Saving mode">
                    <RadioGroup
                        label="How do you want to save?"
                        name="saving_mode"
                        value={formData.saving_mode}
                        onChange={val => handleChange("saving_mode", val)}
                        options={[
                            { value: "auto", label: "Deposit for me each month" },
                            { value: "manual", label: "I'll add to it myself" }
                        ]}
                    />

                    {formData.saving_mode === "auto" && monthly > 0 && (
                        <p className="secondary-text">
                            Based on what's left to save, I'd deposit
                            <strong>{formatCurrency(monthly, currency)}/month</strong>
                            until the deadline.
                        </p>
                    )}

                    {formData.saving_mode === "manual" && (
                        <p className="secondary-text">
                            I won't make automatic deposits. Add to it whenever you're ready.
                        </p>
                    )}
                </Section>

                <Section title="Extra details">
                    <Textarea
                        label="Notes"
                        placeholder="Why does this matter to you?"
                        maxLength={200}
                        value={formData.notes}
                        onChange={e => handleChange("notes", e.target.value)}
                    />

                    <Input
                        label="Link"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.link}
                        onChange={e => handleChange("link", e.target.value)}
                    />

                    <Toggle
                        label="Set as my primary goal"
                        checked={formData.is_primary}
                        onChange={val => handleChange("is_primary", val)}
                    />
                </Section>

                <Button
                    type="submit"
                    disabled={!canSave || Number(formData.target_amount) < goal.current_amount}
                >
                    Save Changes
                </Button>
            </form>
        </div>
    )
}

export default EditSavingGoal
