import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import { useState } from "react"
import PageHeader from "../components/ui/PageHeader"

import "../styles/pages/AddTransaction.css"

function AddTransaction() {
    const [formData, setFormData] = useState({
        amount: "",
        currency: "RON",
        type: "Expense",
        method: "Card",
        category: "",
        date: "Today",
        recurring: false,
        mood: null,
        notes: ""
    })

    function handleChange(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="add-transaction-layout">
            <div className="add-transaction-content">
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

                    {/* Method */}

                    {/* Category */}

                    {/* Date */}

                    {/* Recurring */}

                    {/* Mood */}

                    {/* Notes */}
                </form>
            </div>
        </div>
    )
}

export default AddTransaction