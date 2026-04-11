import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../../store/CurrencyStore"
import { useBudget } from "../../../store/BudgetStore"
import { useCategories } from "../../../store/CategoryStore"

import { formatCurrency } from "../../../utils/currencyUtils"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import SettingsRadio from "../../../components/settings/SettingsRadio"
import Input from "../../../components/forms/Input"

function MonthlyBudget() {
    const navigate = useNavigate()
    const { currency } = useCurrency()
    const { categories } = useCategories()
    const { budget, updateBudget } = useBudget()

    if (!budget) return null

    const expenseCategories = categories
        .filter(c => c.type === "expense" && !c.name.includes("Other"))
        .sort((a, b) => a.name.localeCompare(b.name))

    const totalAllocated = Object.values(budget.categoryBudgets || {})
        .reduce((sum, val) => sum + (val || 0), 0)

    const difference = budget.monthlyBudget - totalAllocated

    return (
        <div className="settings-content">
            <PageHeader title="Monthly Budget" />

            <Section title="Basics">
                <SettingsCard>
                    <SettingsItem 
                        label="Amount"
                        value= {formatCurrency(budget.monthly_limit, currency)}
                        onClick={() => navigate("/settings/budget/amount")}
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
                        value="next_month"
                        checkedValue={budget.rollover}
                        onChange={(val) => updateBudget("rollover", val)}
                    />

                    <SettingsRadio 
                        label="Adds to primary goal automatically"
                        name="rollover"
                        value="primary_goal"
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
                        checkedValue={budget.budget_structure}
                        onChange={(val) => updateBudget("budget_structure", val)}
                    />

                    <SettingsRadio 
                        label="Category-based budgeting"
                        name="structure"
                        value="category"
                        checkedValue={budget.budget_structure}
                        onChange={(val) => updateBudget("budget_structure", val)}
                    />
                </SettingsCard>
            </Section>
        </div>
    )
}

export default MonthlyBudget