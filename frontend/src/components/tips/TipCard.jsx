import Icon from "../ui/Icon"
import Card from "../ui/Card"

import "../../styles/components/TipCard.css"

function TipCard({ children }) {
    return (
        <Card
            title="Tip"
            icon={<Icon name="categories" size={20} />}
            className="tip-card-content"
        >
            {children}
        </Card>
    )
}

export default TipCard