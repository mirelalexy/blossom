import Icon from "../ui/Icon"

import "../../styles/components/FilterPill.css"

function FilterPill({ label, value, onClick, onClear, disabled, pillRef }) {
    const isActive = !!value

    return (
        <button
            ref={pillRef}
            className={`filter-pill ${isActive ? "filter-pill--active" : ""} ${disabled ? "filter-pill--disabled" : ""}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            <span className="filter-pill-text">{isActive ? value : label}</span>

            {isActive && (
                <span
                    className="filter-pill-clear"
                    onClick={(e) => {
                        e.stopPropagation()
                        onClear()
                    }}
                >
                    <Icon name="close" size={12} />
                </span>
            )}
        </button>
    )
}

export default FilterPill
