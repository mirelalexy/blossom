import "../../styles/components/SheetItem.css"

function SheetItem({ label, text, variant, onClick }) {
    return (
        <div className="sheet-item" onClick={onClick}>
            <p className={`sheet-item-label ${variant === "danger" ? "sheet-item-label--danger" : ""}`}>{label}</p>
            <p className="sheet-item-text">{text}</p>
        </div>
    )
}

export default SheetItem