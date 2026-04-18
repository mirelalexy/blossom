import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../../store/CurrencyStore"
import { useBudget } from "../../../store/BudgetStore"
import { useCategories } from "../../../store/CategoryStore"
import { useCategoryBudgets } from "../../../store/CategoryBudgetStore"

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
    const { categoryBudgets, updateCategoryBudget } = useCategoryBudgets()

    if (!budget) return null

    const expenseCategories = categories
        .filter(c => c.type === "expense" && !c.name.includes("Other"))
        .sort((a, b) => a.name.localeCompare(b.name))

    const totalAllocated = categoryBudgets.reduce(
        (sum, b) => sum + Number(b.monthly_limit),
        0
    )

    const difference = (budget.monthly_limit || 0) - totalAllocated

    // helper to read category budgets
    function getCategoryLimit(categoryId) {
        const found = categoryBudgets.find(c => c.category_id === categoryId)
        return found ? Number(found.monthly_limit) : 0
    }

    return (
        <div className="page">
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

            {budget.budget_structure === "category" && (
                <Section title="Category Budgets">
                    {expenseCategories.map(c => (
                        <Input 
                            key={c.id}
                            label={c.name}
                            min={0}
                            type="number"
                            value={getCategoryLimit(c.id)}
                            onChange={(e) => updateCategoryBudget(c.id, e.target.value)}
                        />
                    ))}
                    
                    <p>
                        {difference > 0 && `You still have ${formatCurrency(difference, currency)} to allocate.`}
                        {difference < 0 && `You are over budget by ${formatCurrency(Math.abs(difference), currency)}.`}
                        {difference === 0 && "Budget fully allocated."}
                    </p>
                </Section>
            )}
        </div>
    )
}

export default MonthlyBudget