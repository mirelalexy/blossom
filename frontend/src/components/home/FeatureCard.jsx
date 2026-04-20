import Icon from "../ui/Icon"

function FeatureCard({ icon, title, body }) {
    return (
        <div className="feature-card">
            <div className="feature-card-icon">
                <Icon name={icon} size={18} />
            </div>

            <div className="feature-card-text">
                <p className="feature-card-title">{title}</p>
                <p className="feature-card-body">{body}</p>
            </div>
        </div>
    )
}

export default FeatureCard