import "../../styles/components/EmptyState.css"

function EmptyState({ title, subtitle, action }) {
    return (
        <div className="empty-state">
            <p className="empty-title">{title}</p>

            {subtitle && (
                <p className="empty-subtitle">{subtitle}</p>
            )}

            {action}
        </div>
    )
}

export default EmptyState