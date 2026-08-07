import Button from "../ui/Button"

import useResponsiveSheetMenu from "../../hooks/useResponsiveSheetMenu"

import "../../styles/components/FilterPillMenu.css"

function FilterPillMenu({ isOpen, onClose, title, anchorRef, children }) {
    const {
        isMobile,
        menuRef,
        sheetRef,
        translateY,
        isDragging,
        isClosing,
        triggerClose,
        dragHandlers,
        handleDone
    } = useResponsiveSheetMenu({ isOpen, onClose, anchorRef, scrollLockClass: "menu-open" })

    if (!isOpen) return null

    if (isMobile) {
        return (
            <>
                <div
                    className={`filter-pill-overlay ${isClosing ? "filter-pill-overlay--out" : ""}`}
                    onClick={triggerClose}
                />

                <div
                    className={`filter-pill-sheet ${isClosing ? "filter-pill-sheet--closing" : ""}`}
                    ref={sheetRef}
                    {...dragHandlers}
                    style={{
                        "--sheet-drag-y": `${translateY}px`,
                        transition: isDragging ? "none" : undefined
                    }}
                >
                    <div className="filter-pill-handle-area">
                        <div className="filter-pill-handle" />
                    </div>

                    <h3 className="filter-pill-menu-title">{title}</h3>

                    <div className="filter-pill-menu-content">
                        {children}
                    </div>

                    <Button onClick={handleDone}>Apply</Button>
                </div>            </>
        )
    }

    return (
        <div className="filter-pill-dropdown" ref={menuRef}>
            <div className="filter-pill-dropdown-content">
                {children}
            </div>

            <Button className="small" onClick={handleDone}>Apply</Button>
        </div>
    )
}

export default FilterPillMenu