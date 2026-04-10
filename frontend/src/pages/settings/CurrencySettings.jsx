import { useCurrency } from "../../store/CurrencyStore"

import PageHeader from "../../components/ui/PageHeader"
import Select from "../../components/forms/Select"

function CurrencySettings() {
    const { currency, updateCurrency } = useCurrency()

    function handleCurrencyChange(newCurrency) {
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