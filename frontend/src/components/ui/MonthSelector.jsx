function MonthSelector({ label, isCurrentMonth, canGoPrev, canGoNext, onPrev, onNext }) {
    return (
        <div className="month-selector">
            <button
                className="month-arrow"
                onClick={onPrev}
                disabled={!canGoPrev}
            >
                ←
            </button>

            <span className="month-label">
                {label}
                {isCurrentMonth && <span className="month-current-badge">Current</span>}
            </span>

            <button
                className="month-arrow"
                onClick={onNext}
                disabled={!canGoNext}
            >
                →
            </button>
        </div>
    )
}

export default MonthSelector