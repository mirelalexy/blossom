import "../../styles/components/Card.css"

function Card({ icon, title, children, className="" }) {
    return (
        <div className={`card ${className}`}>
            <div className="card-header">
                {icon && <div className="card-icon">
                    {icon}
                </div>}
                {title && <p>{title}</p>}
            </div>
            
            <div className="card-content">
                {children}
            </div>
        </div>
    )
}

export default Card