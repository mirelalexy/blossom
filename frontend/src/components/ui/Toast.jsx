import "../../styles/components/Toast.css"

function Toast({ message, type }) {
    return (
        <div className={`toast-pill toast-pill-${type}`} role="status">
            {message}
        </div>
    )
}

export default Toast