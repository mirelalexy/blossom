import { useCurrency } from "../../store/CurrencyStore"

import PageHeader from "../../components/ui/PageHeader"
import Select from "../../components/forms/Select"
import Section from "../../components/ui/Section"

function CurrencySettings() {
    const { currency, updateCurrency } = useCurrency()

    function handleCurrencyChange(newCurrency) {
        updateCurrency(newCurrency)
    }

    const currencyOptions = [
        { value: "EUR", label: "EUR" },
        { value: "RON", label: "RON" },
        { value: "USD", label: "USD" },
        { value: "GBP", label: "GBP" },
        { value: "CAD", label: "CAD" }
    ]

    return (
        <div className="page">
            <PageHeader title="Currency" />

            <Section>
                <p className="secondary-text">
                    This only changes how amounts are labeled. It doesn't convert them. This applies 
                    to everything you've already logged, not just new transactions.
                </p>
            </Section>

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