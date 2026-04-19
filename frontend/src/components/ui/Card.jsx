import "../../styles/components/Card.css"

function Card({ icon, title, children, className = "", onClick }) {
    return (
        <div className={`card ${className} ${onClick ? "clickable" : ""}`} onClick={onClick}>
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