import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../../store/CurrencyStore"
import { useBudget } from "../../../store/BudgetStore"
import { formatCurrency } from "../../../utils/currencyUtils"
import { useCategories } from "../../../store/CategoryStore"

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
    const { budget, updateBudget, updateCategoryBudget } = useBudget()

    const expenseCategories = categories
        .filter(c => c.type === "expense" & !c.id.includes("other"))
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
                        value= {formatCurrency(budget.monthlyBudget, currency)}
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

            {budget.structure === "category" && (
                <Section title="Category Budgets">
                        {expenseCategories.map(c => (
                            <Input 
                                key={c.id}
                                label={c.name}
                                min={0}
                                type="number"
                                value={budget.categoryBudgets?.[c.id] || 0}
                                onChange={(e) => updateCategoryBudget(c.id, e.target.value)}
                            />
                        ))}

                        {budget.structure === "category" && (
                            <p>
                                {difference > 0 && `You still have ${formatCurrency(difference, currency)} to allocate.`}
                                {difference < 0 && `You are over budget by ${formatCurrency(Math.abs(difference), currency)}.`}
                                {difference === 0 && "Budget fully allocated."}
                            </p>
                        )}
                </Section>
            )}
        </div>
    )
}

export default MonthlyBudget