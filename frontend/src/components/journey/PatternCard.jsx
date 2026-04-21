import Icon from "../ui/Icon"

import "../../styles/components/PatternCard.css"

function PatternCard({ icon, text, detail }) {
    return (
        <div className="pattern-card">
            <div className="pattern-icon-wrap">
                <Icon name={icon} size={18} />
            </div>
            
            <div className="pattern-body">
                <p className="pattern-text">{text}</p>
                {detail && <p className="pattern-detail secondary-text">{detail}</p>}
            </div>
        </div>
    )
}

export default PatternCard