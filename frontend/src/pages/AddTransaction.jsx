import Button from "../components/ui/Button"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "../components/ui/PageHeader"
import RadioGroup from "../components/forms/RadioGroup"

import { categories } from "../data/mock/categories"

import "../styles/pages/AddTransaction.css"
import Toggle from "../components/forms/Toggle"
import MoodSelector from "../components/forms/MoodSelector"
import Textarea from "../components/forms/Textarea"

import { useTransactions } from "../store/TransactionStore"
import { useCategories } from "../store/CategoryStore"

function AddTransaction() { 
    const navigate = useNavigate()

    const { id } = useParams()

    const { transactions, addTransaction, updateTransaction } = useTransactions()

    const existingTransaction = transactions.find(t => t.id === Number(id))
    
    const today = new Date().toISOString().split("T")[0]

    const [formData, setFormData] = useState(
        existingTransaction || {
        amount: "",
        type: "Expense",
        method: "Card",
        merchant: "",
        categoryId: "",
        date: today,
        recurring: false,
        frequency: "monthly",
        mood: null,
        intent: null,
        notes: ""
    })

    function handleChange(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        const [year, month, day] = formData.date.split("-")
        const transactionDate = new Date(year, month - 1, day)

        const newTransaction = {
            id: existingTransaction ? existingTransaction.id : Date.now(),
            amount: Number(formData.amount),
            type: formData.type,
            method: formData.method,
            merchant: formData.merchant,
            categoryId: formData.categoryId,
            date: formData.date,
            mood: formData.mood,
            intent: formData.intent,
            notes: formData.notes,
            recurring: formData.recurring
                ? {
                    frequency: formData.frequency,
                    dayOfMonth:
                        formData.frequency === "monthly"
                            ? transactionDate.getDate() 
                            : null,
                    dayOfWeek: 
                        formData.frequency === "weekly" 
                            ? transactionDate.getDay()
                            : null,
                } 
                : null
        }

        console.log(newTransaction)

        if(existingTransaction) {
            updateTransaction(newTransaction)
        } else {
            addTransaction(newTransaction)
        }

        navigate("/transactions")
    }

    const { getCategoriesByType } = useCategories()

    const categoryOptions = [
        { value: "", label: "Select category" },
        ...getCategoriesByType(formData.type).map(cat => ({
            value: cat.id,
            label: cat.name
        }))
    ]

    return (
        <div className="add-transaction-layout">
            <div className="add-transaction-content">
                <PageHeader title={existingTransaction ? "Edit Transaction" : "Add Transaction"}></PageHeader>

                <form className="add-transaction-form" onSubmit={handleSubmit}>
                    {/* Amount */}
                    <Input 
                        label="Amount"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                    />

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

                    {/* Merchant */}
                    <Input 
                        label="Merchant"
                        type="text"
                        value={formData.merchant}
                        onChange={(e) => handleChange("merchant", e.target.value)}
                    />

                    {/* Category */}
                    <Select 
                        label="Category"
                        name="category"
                        value={formData.categoryId}
                        onChange={(e) => handleChange("categoryId", e.target.value)}
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

                    {/* Intent */}
                    {formData.type === "Expense" && (
                        <RadioGroup
                            label="Purchase Intent"
                            name="intent"
                            value={formData.intent}
                            onChange={(val) => handleChange("intent", val)}
                            options={[
                                { value: "Necessary", label: "Necessary" },
                                { value: "Planned", label: "Planned" },
                                { value: "Impulse", label: "Impulse" }
                            ]}
                        />
                    )}

                    {/* Notes */}
                    <Textarea 
                        label="Notes"
                        placeholder="Add a note (optional)"
                        maxlength={200}
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                    />
                    
                    <Button type="submit">Save Transaction</Button>
                </form>
            </div>
        </div>
    )
}

export default AddTransaction