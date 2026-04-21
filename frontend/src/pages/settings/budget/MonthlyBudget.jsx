import { useState, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../../store/CurrencyStore"
import { useBudget } from "../../../store/BudgetStore"
import { useCategories } from "../../../store/CategoryStore"
import { useCategoryBudgets } from "../../../store/CategoryBudgetStore"
import { useToast } from "../../../store/ToastStore"

import { formatCurrency } from "../../../utils/currencyUtils"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import SettingsRadio from "../../../components/settings/SettingsRadio"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"

import "../../../styles/pages/MonthlyBudget.css"

// debounce delay for category inputs
const DEBOUNCE_MS = 800

function MonthlyBudget() {
    const navigate = useNavigate()
    const { currency } = useCurrency()
    const { categories } = useCategories()
    const { budget, updateBudget } = useBudget()
    const { categoryBudgets, updateCategoryBudget } = useCategoryBudgets()
    const { showToast } = useToast()

    // local draft state for category inputs (avoid API call on every keypress)
    const [drafts, setDrafts] = useState({})
    const [saving, setSaving] = useState(false)
    const debounceRef = useRef({})

    if (!budget) return null

    const expenseCategories = categories
        .filter(c => c.type === "expense" && !c.name.includes("Other"))
        .sort((a, b) => a.name.localeCompare(b.name))

    // helper to read category budgets
    function getCategoryLimit(categoryId) {
        // prefer local draft if user is mid-edit
        if (drafts[categoryId] !== undefined) return drafts[categoryId]
         
        const found = categoryBudgets.find(c => c.category_id === categoryId)
        return found ? Number(found.monthly_limit) : 0
    }

    const totalAllocated = expenseCategories.reduce((sum, c) => {
        const val = drafts[c.id] !== undefined
            ? Number(drafts[c.id]) || 0
            : (categoryBudgets.find(b => b.category_id === c.id)
                ? Number(categoryBudgets.find(b => b.category_id === c.id).monthly_limit)
                : 0
              )
        
        return sum + val
    }, 0)

    const difference = (budget.monthly_limit || 0) - totalAllocated

    function handleCategoryChange(categoryId, value) {
        setDrafts(prev => ({ ...prev, [categoryId]: value }))
    
        // clear existing debounce for category
        if (debounceRef.current[categoryId]) {
            clearTimeout(debounceRef.current[categoryId])
        }
    }

    async function handleSaveAll() {
        setSaving(true)

        try {
            // save all drafts
            const updates = Object.entries(drafts).map(([categoryId, value]) =>
                updateCategoryBudget(categoryId, Number(value) || 0)
            )

            await Promise.all(updates)

            setDrafts({})
            showToast({ message: "Category budgets saved" })
        } catch (err) {
            showToast({ message: "Something went wrong", type: "error" })
        } finally {
            setSaving(false)
        }
    }

    const hasDraftChanges = Object.keys(drafts).length > 0

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
                    <p className="secondary-text">
                        Set a monthly spending limit per category. I'll warn you before
                        you log a transaction that would push a category over its limit.
                        Leave a category at 0 to leave it uncapped.
                    </p>

                    {expenseCategories.map(c => (
                        <Input 
                            key={c.id}
                            label={c.name}
                            min={0}
                            type="number"
                            value={getCategoryLimit(c.id)}
                            onChange={(e) => handleCategoryChange(c.id, e.target.value)}
                        />
                    ))}
                    
                    <p className={`category-budget-status ${difference < 0 ? "over" : ""}`}>
                        {difference > 0 && `You still have ${formatCurrency(difference, currency)} to allocate.`}
                        {difference < 0 && `You are over budget by ${formatCurrency(Math.abs(difference), currency)}.`}
                        {difference === 0 && "Budget fully allocated across categories."}
                    </p>

                    {hasDraftChanges && (
                        <Button onClick={handleSaveAll} disabled={saving}>
                            {saving ? "Saving…" : "Save Category Budgets"}
                        </Button>
                    )}
                    
                    {!hasDraftChanges && categoryBudgets.length > 0 && (
                        <p className="additional-info">All category limits saved.</p>
                    )}
                </Section>
            )}
        </div>
    )
}

export default MonthlyBudget