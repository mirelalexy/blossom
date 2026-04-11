import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useBudget } from "../../../store/BudgetStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"

function Amount() {
    const navigate = useNavigate()
    const { budget, updateBudget } = useBudget() 
    const [amount, setAmount] = useState(budget?.monthly_budget)

    function handleSave() {
        if (!amount || amount <= 0) {
            alert("Please enter a valid budget amount.")
            return
        }

        updateBudget("monthly_limit", amount)
        navigate(-1)
    }

    return (
        <div className="settings-content">
            <PageHeader title="Amount" />

            <Input 
                label="Amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />

            <Button 
                onClick={handleSave}
                disabled={!amount || amount <= 0}
            >
                Save
            </Button>
        </div>
    )
}

export default Amount