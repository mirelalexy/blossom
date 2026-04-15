import { useNavigate, useParams } from "react-router-dom"

import { useCategories } from "../../../store/CategoryStore"
import { useTransactions } from "../../../store/TransactionStore"
import { useCurrency } from "../../../store/CurrencyStore"
import { useCategoryBudgets } from "../../../store/CategoryBudgetStore"

import { formatCurrency } from "../../../utils/currencyUtils"
import { getStartOfDay, parseLocalDate } from "../../../utils/dateUtils"
import { appIcons } from "../../../utils/appIcons"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import Button from "../../../components/ui/Button"

function CategoryDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { transactions } = useTransactions()
    const { currency } = useCurrency()

    const { categories, getCategoryById, deleteCategory } = useCategories()
    const { categoryBudgets } = useCategoryBudgets()
    const { reassignCategory } = useTransactions()

    const category = getCategoryById(id)

    if (!category) {
        return <p>Category not found.</p>
    }

    const Icon = appIcons[category.icon]

    function handleDelete() {
        const confirmed = window.confirm("Delete this category? Transactions will be moved to Other category.")
        if (!confirmed) return

        const fallbackCategory = categories.find(
            c => c.type === category.type && c.is_default && c.name.includes("Other")
        )

        if (!fallbackCategory) {
            alert("Fallback category not found.")
            return
        }

        reassignCategory(category.id, fallbackCategory.id)
        deleteCategory(category.id)
        navigate(-1)
    }

    const today = getStartOfDay(new Date())

    const spent = transactions
        .filter(t => {
            if (!t.date) return false

            const date = parseLocalDate(t.date)

            return (
                t.categoryId === id &&
                t.type === "expense" &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            )
        })
        .reduce((sum, t) => sum + t.amount, 0)

    const categoryBudgetObj = categoryBudgets?.find(b => b.category_id === id)

    const hasBudget = categoryBudgetObj !== undefined

    const categoryBudget = categoryBudgetObj
        ? Number(categoryBudgetObj.monthly_limit)
        : 0

    const remaining = hasBudget
        ? categoryBudget - spent
        : null

    return (
        <div className="settings-content">
            <PageHeader title="Category Details" />

            <div className="transaction-details-card">
                    <Section className="transaction-section transaction-summary">
                        <div>
                            {Icon && <Icon size={35} />}
                        </div>
                        <div>
                            <h2>{category.name}</h2>
                            <p>{category.type === "expense" ? "Expense" : "Income"}</p>
                        </div>
                             
                    </Section>

                    <Section title="This Month">
                        <p>Spent: {formatCurrency(spent, currency)}</p>
                        <p>
                            {hasBudget
                                ? `Budget: ${formatCurrency(categoryBudget, currency)}`
                                : "No budget set for this category."
                            }
                        </p>

                        {hasBudget && (
                            <p>Remaining: {formatCurrency(remaining, currency)}</p>
                        )}

                        {remaining < 0 && (
                            <p className="red-text">You are over budget by {formatCurrency(Math.abs(remaining), currency)}.</p>
                        )}
                    </Section>

                    <div className="transaction-actions">
                        <Button 
                            disabled={category.is_default} 
                            onClick={() => navigate(`/settings/categories/edit/${category.id}`)}
                        >
                            Edit
                        </Button>
                        <Button 
                            disabled={category.is_default} 
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>

                    {category.is_default && (
                        <p>Default categories cannot be edited or deleted.</p>
                    )}
                </div>
        </div>
    )
}

export default CategoryDetails