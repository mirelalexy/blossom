import "../../styles/components/Button.css"

function Button({ icon, children, onClick, type = "button", className, disabled }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button ${className || ""}`}
        >
            {icon && <div className="button-icon">
                {icon}
            </div>}

            <span>
                {children}
            </span>
        </button>
    )
}

export default Button