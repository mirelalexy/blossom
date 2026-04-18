import "../../styles/components/XPToast.css"

function XPToast({ xp }) {
    return (
        <div className="xp-toast">
            +{xp.gained} XP ✦
            {xp.leveledUp && <span>Level up!</span>}
        </div>
    )
}

export default XPToast