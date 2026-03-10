import "../../styles/components/Button.css"

function Button({ icon, children, onClick, type="button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="button"
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