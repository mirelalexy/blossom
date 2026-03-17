import { useCurrency } from "../../store/CurrencyStore"
import { useTransactions } from "../../store/TransactionStore"
import { useGoals } from "../../store/GoalsStore"

import PageHeader from "../../components/ui/PageHeader"
import Select from "../../components/forms/Select"

function CurrencySettings() {
    const { currency, updateCurrency } = useCurrency()
    const { transactions, clearTransactions } = useTransactions()
    const { clearGoals } = useGoals()

    function handleCurrencyChange(newCurrency) {
        if (transactions.length > 0) {
            const confirmReset = window.confirm("Changing currency will reset your financial data. Continue?")

            if (!confirmReset) return

            clearTransactions()
            clearGoals()
        }

        updateCurrency(newCurrency)
    }

    const currencyOptions = [
        { value: "EUR", label: "EUR" },
        { value: "RON", label: "RON" },
        { value: "USD", label: "USD" },
        { value: "GBP", label: "GBP" }
    ]

    return (
        <div className="settings-content">
            <PageHeader title="Currency" />

            <Select 
                label="Currency"
                name="currency"
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                options={currencyOptions}
            />
        </div>
    )
}

export default CurrencySettings