import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../../store/CurrencyStore"
import { useBudget } from "../../../store/BudgetStore"
import { formatCurrency } from "../../../utils/currencyUtils"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import SettingsRadio from "../../../components/settings/SettingsRadio"

function MonthlyBudget() {
    const navigate = useNavigate()
    const { currency } = useCurrency()
    const { budget, updateBudget, updateCategoryBudget } = useBudget()

    return (
        <div className="settings-content">
            <PageHeader title="Monthly Budget" />

            <Section title="Basics">
                <SettingsCard>
                    <SettingsItem 
                        label="Amount"
                        value= {formatCurrency(budget, currency)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Rollover">
                <SettingsCard>
                    <SettingsRadio 
                        label="Does not roll over"
                        name="rollover"
                        value="none"
                        checkedValue={budget.rollover}
                        onChange={(val) => updateBudget("rollover", val)}
                    />

                    <SettingsRadio 
                        label="Rolls over to next month"
                        name="rollover"
                        value="nextMonth"
                        checkedValue={budget.rollover}
                        onChange={(val) => updateBudget("rollover", val)}
                    />

                    <SettingsRadio 
                        label="Adds to primary goal automatically"
                        name="rollover"
                        value="primaryGoal"
                        checkedValue={budget.rollover}
                        onChange={(val) => updateBudget("rollover", val)}
                    />
                </SettingsCard>
            </Section>

            <Section title="Budget Structure">
                <SettingsCard>
                    <SettingsRadio 
                        label="Single total budget"
                        name="structure"
                        value="total"
                        checkedValue={budget.structure}
                        onChange={(val) => updateBudget("structure", val)}
                    />

                    <SettingsRadio 
                        label="Category-based budgeting"
                        name="structure"
                        value="category"
                        checkedValue={budget.structure}
                        onChange={(val) => updateBudget("structure", val)}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default MonthlyBudget