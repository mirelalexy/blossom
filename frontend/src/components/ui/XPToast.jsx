import "../../styles/components/Toast.css"

function XPToast({ gained, leveledUp }) {
    return (
        <div className="toast-pill toast-pill--xp" role="status">
            <span className="xp-pill-gain">+{gained} XP ✦</span>
            {leveledUp && <span className="xp-pill-level">Level up!</span>}
        </div>
    )
}

export default XPToast