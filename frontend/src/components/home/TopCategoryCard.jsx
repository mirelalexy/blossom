import Button from "../ui/Button";
import Card from "../ui/Card";

import "./TopCategoryCard.css"

function TopCategoryCard() {
    const topCategory = "Food";

    return (
        <Card 
            className="top-category-card" 
            title="Top Category" 
            icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <g clip-path="url(#clip0_185_1819)">
                    <path d="M5.70792 11.8752L2.10583 5.65266C1.95051 5.38419 1.87746 5.076 1.89576 4.76638C1.91405 4.45675 2.02289 4.15931 2.20875 3.911L3.48333 2.21683C3.63081 2.02019 3.82206 1.86058 4.04191 1.75065C4.26176 1.64073 4.50419 1.5835 4.75 1.5835H14.25C14.4958 1.5835 14.7382 1.64073 14.9581 1.75065C15.1779 1.86058 15.3692 2.02019 15.5167 2.21683L16.7833 3.911C16.9704 4.15851 17.0807 4.45554 17.1004 4.76518C17.1201 5.07482 17.0484 5.38343 16.8942 5.65266L13.2921 11.8752" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.70833 9.50003L4.05333 1.7417" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.2917 9.50003L14.9467 1.7417" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.33334 5.5415H12.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.5 17.4167C11.6861 17.4167 13.4583 15.6445 13.4583 13.4583C13.4583 11.2722 11.6861 9.5 9.5 9.5C7.31387 9.5 5.54166 11.2722 5.54166 13.4583C5.54166 15.6445 7.31387 17.4167 9.5 17.4167Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.5 14.2498V12.6665H9.10416" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_185_1819">
                        <rect width="19" height="19" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            }
        >
            <div className="top-category-card-content">
                <p><span>{topCategory}</span> is your highest spend this month.</p>
                <Button>View Categories</Button>
            </div>
        </Card>
    )
}

export default TopCategoryCard;