import Icon from "../ui/Icon"

import "../../styles/components/PatternCard.css"

function PatternCard({ icon, text }) {
    return (
        <div className="card pattern-card
        ">
            <Icon name={icon} size={17} />
            <p className="pattern-text">{text}</p>
        </div>
    )
}

export default PatternCard