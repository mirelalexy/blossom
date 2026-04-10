import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Card from "../ui/Card"
import Icon from "../ui/Icon"

function TopCategoryCard({ category }) {
    const navigate = useNavigate()

    return (
        <Card 
            className="top-category-card" 
            title="Top Category" 
            icon={
            <Icon name="topCategory" size={20} />
            }
        >
                <p className="normal-text"><strong>{category?.name}</strong> is your highest spending category this month.</p>
                <Button
                    onClick={() => navigate("/transactions", {
                        state: { categoryId: category.id }
                        })
                    }
                >
                    View Category
                </Button>
        </Card>
    )
}

export default TopCategoryCard