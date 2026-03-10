import Button from "../ui/Button";
import Card from "../ui/Card";
import Icon from "../ui/Icon";

import "./TopCategoryCard.css"

function TopCategoryCard({ category }) {
    return (
        <Card 
            className="top-category-card" 
            title="Top Category" 
            icon={
            <Icon name="topCategory" size={20} />
            }
        >
            <div className="top-category-card-content">
                <p><span>{category}</span> is your highest spend this month.</p>
                <Button>View Categories</Button>
            </div>
        </Card>
    )
}

export default TopCategoryCard;