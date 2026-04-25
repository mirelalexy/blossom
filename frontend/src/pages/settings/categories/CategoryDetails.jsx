import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useCategories } from "../../../store/CategoryStore"
import { useTransactions } from "../../../store/TransactionStore"
import { useCurrency } from "../../../store/CurrencyStore"
import { useCategoryBudgets } from "../../../store/CategoryBudgetStore"

import { formatCurrency } from "../../../utils/currencyUtils"
import { getStartOfDay, parseLocalDate } from "../../../utils/dateUtils"
import { appIcons } from "../../../utils/appIcons"

import PageHeader from "../../../components/ui/PageHeader"
import ProgressBar from "../../../components/ui/ProgressBar"
import ConfirmModal from "../../../components/ui/ConfirmModal"
import Button from "../../../components/ui/Button"

import "../../../styles/pages/CategoryDetails.css"

function CategoryDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { transactions, reassignCategory } = useTransactions()
    const { currency } = useCurrency()
    const { categories, getCategoryById, deleteCategory } = useCategories()
    const { categoryBudgets } = useCategoryBudgets()
    
    const [showConfirm, setShowConfirm] = useState(false)

    const category = getCategoryById(id)

    if (!category) {
        return (
            <div className="page">
                <PageHeader title="Category" />
                <p className="secondary-text" style={{ padding: "24px", textAlign: "center" }}>
                    This category no longer exists.
                </p>
            </div>
        )
    }

    const today = getStartOfDay(new Date())
    const now = new Date()

    // this month's transactions in this category
    const monthlyInCategory = transactions.filter(t => {
        if (!t.date || t.categoryId !== id) return false
        const d = parseLocalDate(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const isExpenseCategory = category.type === "expense"

    const spent  = monthlyInCategory
        .filter(t => t.type === "expense" && getStartOfDay(parseLocalDate(t.date)) <= today)
        .reduce((s, t) => s + t.amount, 0)

    const earned = monthlyInCategory
        .filter(t => t.type === "income")
        .reduce((s, t) => s + t.amount, 0)

    const transactionCount = monthlyInCategory.length
    const avgAmount = transactionCount > 0
        ? monthlyInCategory.reduce((s, t) => s + t.amount, 0) / transactionCount
        : 0

    const CategoryIcon = appIcons[category.icon]

    // category budget
    const budgetObj = categoryBudgets?.find(b => b.category_id === id)
    const categoryBudget = budgetObj ? Number(budgetObj.monthly_limit) : 0
    const hasBudget = categoryBudget > 0
    const remaining = hasBudget ? categoryBudget - spent : null
    const pctUsed = hasBudget ? Math.min(Math.round((spent / categoryBudget) * 100), 100) : 0
    const isOverBudget = remaining !== null && remaining < 0

    function handleDelete() {
        const fallbackCategory = categories.find(
            c => c.type === category.type && c.is_default && c.name.includes("Other")
        )

        if (fallbackCategory) reassignCategory(category.id, fallbackCategory.id)

        deleteCategory(category.id)
        navigate(-1)
    }

    return (
        <div className="page">
            <PageHeader title="Category" />

            <div className="cd-hero">
                <div className={`cd-icon-wrap cd-icon-wrap--${category.type}`}>
                    {CategoryIcon && <CategoryIcon size={28} />}
                </div>

                <p className="cd-name">{category.name}</p>

                <span className="cd-type-badge">
                    {category.type === "expense" ? "Expense" : "Income"}
                </span>

                {category.is_default && (
                    <span className="cd-default-badge">Default</span>
                )}
            </div>

            <div className="cd-card">
                <p className="cd-card-title">This month</p>

                <div className="cd-stat-row">
                    <div className="cd-stat">
                        <span className="cd-stat-label">
                            {isExpenseCategory ? "Spent" : "Earned"}
                        </span>

                        <span className="cd-stat-value">
                            {formatCurrency(isExpenseCategory ? spent : earned, currency)}
                        </span>
                    </div>

                    <div className="cd-stat">
                        <span className="cd-stat-label">Transactions</span>
                        <span className="cd-stat-value">{transactionCount}</span>
                    </div>

                    <div className="cd-stat">
                        <span className="cd-stat-label">Avg. Amount</span>
                        <span className="cd-stat-value">{formatCurrency(avgAmount, currency)}</span>
                    </div>
                </div>

                {isExpenseCategory && hasBudget && (
                    <div className="cd-budget-section">
                        <div className="cd-budget-header">
                            <span className="cd-stat-label">
                                {isOverBudget ? "Over budget by" : "Budget remaining"}
                            </span>

                            <span className={`cd-budget-remaining ${isOverBudget ? "cd-budget-over" : ""}`}>
                                {isOverBudget
                                    ? `−${formatCurrency(Math.abs(remaining), currency)}`
                                    : formatCurrency(remaining, currency)
                                }
                            </span>
                        </div>

                        <ProgressBar progress={pctUsed} />

                        <p className="cd-budget-meta secondary-text">
                            {formatCurrency(spent, currency)} of {formatCurrency(categoryBudget, currency)} limit
                        </p>
                    </div>
                )}

                {isExpenseCategory && !hasBudget && (
                    <p className="secondary-text cd-no-budget">
                        No monthly limit set for this category.{" "}
                        <span
                            className="cd-set-budget-link"
                            onClick={() => navigate("/settings/budget")}
                        >
                            Add one →
                        </span>
                    </p>
                )}
            </div>

            {/* ── ACTIONS ── */}
            {!category.is_default && (
                <div className="td-actions">
                    <Button
                        className="secondary"
                        onClick={() => navigate(`/settings/categories/edit/${category.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        className="danger"
                        onClick={() => setShowConfirm(true)}
                    >
                        Delete
                    </Button>
                </div>
            )}

            {category.is_default && (
                <p className="secondary-text" style={{ textAlign: "center", fontSize: 13 }}>
                    Default categories can't be edited or deleted.
                </p>
            )}

            {showConfirm && (
                <ConfirmModal
                    title={`Delete "${category.name}"?`}
                    message="Any transactions in this category will be moved to Other. This can't be undone."
                    confirmLabel="Delete category"
                    cancelLabel="Keep it"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default CategoryDetails