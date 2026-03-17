import { useNavigate, useParams } from "react-router-dom"

import { appIcons } from "../../../utils/appIcons"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import Icon from "../../../components/ui/Icon"

import Button from "../../../components/ui/Button"
import { useCategories } from "../../../store/CategoryStore"
import { useTransactions } from "../../../store/TransactionStore"

function CategoryDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

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