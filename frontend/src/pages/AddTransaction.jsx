import Button from "../components/ui/Button"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import { useState } from "react"
import PageHeader from "../components/ui/PageHeader"
import RadioGroup from "../components/forms/RadioGroup"

import { categories } from "../data/mock/categories"

import "../styles/pages/AddTransaction.css"
import Toggle from "../components/forms/Toggle"
import MoodSelector from "../components/forms/MoodSelector"
import Textarea from "../components/forms/Textarea"

function AddTransaction() {
    const today = new Date().toISOString().split("T")[0]

    const [formData, setFormData] = useState({
        amount: "",
        currency: "RON",
        type: "Expense",
        method: "Card",
        category: "",
        date: today,
        recurring: false,
        frequency: "monthly",
        dayOfMonth: null,
        dayOfWeek: null,
        mood: null,
        notes: ""
    })

    function handleChange(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const categoryOptions = categories.map((cat) => ({
        value: cat.name,
        label: cat.name
    }))

    return (
        <div className="add-transaction-layout">
            <div className="add-transaction-content">
                <PageHeader title="Add Transaction"></PageHeader>

                <form className="add-transaction-form">
                    {/* Amount and Currency */}
                    <div className="amount-input">
                        <label className="input-label">Amount</label>
                        <div className="amount-row">
                            <Input name="Amount" type="number" placeholder="0" value={formData.amount} onChange={(e) => handleChange("amount", e.target.value)}></Input>
                            <Select name="Currency" value={formData.currency} onChange={(e) => handleChange("currency", e.target.value)}
                                options={[
                                    { value: "RON", label: "RON" },
                                    { value: "EUR", label: "EUR" },
                                    { value: "GBP", label: "GBP" },
                                    { value: "USD", label: "USD" }
                                ]}>
                            </Select>
                        </div>
                    </div>

                    {/* Type */}
                    <RadioGroup
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={(val) => handleChange("type", val)}
                        options={[
                            { value: "Expense", label: "Expense" },
                            { value: "Income", label: "Income" }
                        ]}
                    />

                    {/* Method */}
                    <RadioGroup
                        label="Method"
                        name="method"
                        value={formData.method}
                        onChange={(val) => handleChange("method", val)}
                        options={[
                            { value: "Card", label: "Card" },
                            { value: "Cash", label: "Cash" }
                        ]}
                    />

                    {/* Category */}
                    <Select 
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        options={categoryOptions}
                    />

                    {/* Date */}
                    <Input 
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                    />

                    {/* Recurring */}
                    <Toggle
                        label="Recurring"
                        checked={formData.recurring}
                        onChange={(val) => handleChange("recurring", val)}    
                    />

                    {formData.recurring && (
                        <Select 
                            label="Frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={(e) => handleChange("frequency", e.target.value)}
                            options={[
                                { value: "monthly", label: "Monthly" },
                                { value: "weekly", label: "Weekly" }
                            ]}
                        />
                    )}

                    {/* Mood */}
                    <MoodSelector 
                        label="Mood"
                        value={formData.mood}
                        onChange={(val) => handleChange("mood", val)}
                    />

                    {/* Notes */}
                    <Textarea 
                        label="Notes"
                        placeholder="Add a note (optional)"
                        maxlength={200}
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                    />
                </form>
            </div>
        </div>
    )
}

export default AddTransaction