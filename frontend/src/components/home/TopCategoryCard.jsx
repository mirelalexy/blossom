import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Card from "../ui/Card"
import Icon from "../ui/Icon"
import EmptyState from "../ui/EmptyState"

import "./TopCategoryCard.css"

function TopCategoryCard({ category }) {
    const navigate = useNavigate()

    if (!category) {
        return (
            <EmptyState title="No spending data yet." />
        )
    }

    return (
        <Card 
            className="top-category-card" 
            title="Top Category" 
            icon={
            <Icon name="topCategory" size={20} />
            }
        >
            <div className="top-category-card-content">
                <p><span>{category.name}</span> is your highest spend this month.</p>
                <Button
                    onClick={() => navigate("/transactions", {
                        state: { categoryId: category.id }
                        })
                    }
                >
                    View Category
                </Button>
            </div>
        </Card>
    )
}

export default TopCategoryCard