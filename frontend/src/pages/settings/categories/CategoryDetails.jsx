import { useNavigate, useParams } from "react-router-dom"

import { useCategories } from "../../../store/CategoryStore"
import { useTransactions } from "../../../store/TransactionStore"
import { useBudget } from "../../../store/BudgetStore"
import { useCurrency } from "../../../store/CurrencyStore"

import { formatCurrency } from "../../../utils/currencyUtils"
import { appIcons } from "../../../utils/appIcons"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import Button from "../../../components/ui/Button"

function CategoryDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { transactions } = useTransactions()
    const { budget } = useBudget()
    const { currency } = useCurrency()

    const { getCategoryById, deleteCategory } = useCategories()
    const { reassignCategory } = useTransactions()

    const category = getCategoryById(id)

    if (!category) {
        return <p>Category not found.</p>
    }

    const Icon = appIcons[category.icon]

    function handleDelete() {
        const confirmed = window.confirm("Delete this category? Transactions will be moved to Other category.")
        if (!confirmed) return

        const fallbackCategoryId =
            category.type === "expense"
                ? "other-expense"
                : "other-income"

        reassignCategory(category.id, fallbackCategoryId)
        deleteCategory(category.id)
        navigate(-1)
    }

    const today = new Date()

    const spent = transactions
        .filter(t => {
            if (!t.date) return false

            const date = new Date(t.date)

            return (
                t.categoryId === id &&
                t.type === "Expense" &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            )
        })
        .reduce((sum, t) => sum + t.amount, 0)

    const categoryBudget = budget.categoryBudgets?.[id] || 0
    const remaining = categoryBudget - spent

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
                            {categoryBudget !== 0 
                                ? `Budget: ${formatCurrency(categoryBudget, currency)}`
                                : "No budget set for this category."
                            }
                        </p>

                        {categoryBudget !== 0 && (
                            <p>Remaining: {formatCurrency(remaining, currency)}</p>
                        )}

                        {remaining < 0 && (
                            <p>You are over budget.</p>
                        )}
                    </Section>

                    <div className="transaction-actions">
                        <Button 
                            disabled={category.default} 
                            onClick={() => {
                                                if (category.default) return
                                                navigate(`/settings/categories/edit/${category.id}`)
                                            }
                                    }
                        >
                            Edit
                        </Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </div>

                    {category.default && (
                        <p>Default categories cannot be edited.</p>
                    )}
                </div>
        </div>
    )
}

export default CategoryDetails