import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

function AddSavingGoal() {
    const navigate = useNavigate()

    const { addGoal } = useGoals()
    const { currency } = useCurrency()

    // avoid timezone bug
    const today = new Date().toLocaleDateString("en-CA")

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

    function calculateMonthlyContribution() {
        const { target_amount, deadline } = formData
        if (!target_amount || !deadline) return 0

        const start = new Date()
        const end = parseLocalDate(deadline)

        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

        if (months <= 0) return Number(target_amount)

        return Math.ceil(Number(target_amount) / months)
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (!formData.name.trim() || !formData.target_amount || Number(formData.target_amount) <= 0) return

        addGoal({
            name: formData.name,
            target_amount: Number(formData.target_amount),
            deadline: formData.deadline,
            notes: formData.notes,
            link: formData.link,
            is_primary: formData.is_primary,
            saving_mode: formData.saving_mode
        })

        navigate("/goals")
    }

    const monthly = calculateMonthlyContribution()
    const canSubmit = formData.name.trim() && formData.target_amount && Number(formData.target_amount) > 0

    return (
        <div className="page">
            <PageHeader title="New Goal" />

            <form className="form" onSubmit={handleSubmit}>
                <Section title="What are you saving for?">
                    {/* Name */}
                    <Input 
                        label="Name"
                        type="text"
                        placeholder="Emergency fund, new laptop, trip to Japan..."
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />

                    {/* Target */}
                    <Input 
                        label="Target Amount"
                        type="number"
                        placeholder="0"
                        value={formData.target_amount}
                        onChange={(e) => handleChange("target_amount", e.target.value)}
                        required
                    />

                    {/* Date */}
                    <Input 
                        label="Deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleChange("deadline", e.target.value)}
                    />
                </Section>

                <Section title="How do you want to save?">
                    {/* Monthly Contribution */}
                    <RadioGroup
                        label="Saving Mode"
                        name="saving_mode"
                        value={formData.saving_mode}
                        onChange={(val) => handleChange("saving_mode", val)}
                        options={[
                            { value: "auto", label: "Deposit for me each month" },
                            { value: "manual", label: "I'll add to it myself" }
                        ]}
                    />

                    {formData.saving_mode === "auto" && (
                        <div className="saving-mode-preview">
                            {monthly > 0 && formData.deadline ? (
                                <>
                                    <p className="saving-mode-amount">
                                        {formatCurrency(monthly, currency)}<span>/month</span>
                                    </p>

                                    <p className="secondary-text saving-mode-detail">
                                        I'll automatically deposit this at the start of each month
                                        and log it as a Goals transaction. You can still add more manually
                                        whenever you want.
                                    </p>
                                </>
                            ) : (
                                <p className="secondary-text">
                                    Set a target and a deadline and I'll show you the monthly amount.
                                </p>
                            )}
                        </div>
                    )}

                    {formData.saving_mode === "manual" && (
                        <p className="secondary-text">
                            I won't touch this goal automatically. Add to it whenever you're ready
                            using the card on your Goals page.
                        </p>
                    )}
                </Section>
                    
                <Section title="Extra details (optional)">
                    {/* Notes */}
                    <Textarea 
                        label="Notes"
                        placeholder="Why does this matter to you?"
                        maxlength={200}
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                    />

                    {/* Link */}
                    <Input 
                        label="Link"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.link}
                        onChange={(e) => handleChange("link", e.target.value)}
                    />

                    {/* Primary Goal */}
                    <Toggle
                        label="Set as my primary goal"
                        checked={formData.is_primary}
                        onChange={(val) => handleChange("is_primary", val)}    
                    />

                    {formData.is_primary && (
                        <p className="secondary-text">
                            Your primary goal stays visible on the home screen and can receive
                            automatic rollover from your monthly budget.
                        </p>
                    )}
                </Section>

                <Button type="submit" disabled={!canSubmit}>Plant New Goal</Button>
            </form>
        </div>
    )
}

export default AddSavingGoal