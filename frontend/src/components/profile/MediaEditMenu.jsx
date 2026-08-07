import Section from "../ui/Section"
import SettingsCard from "../../components/settings/SettingsCard"
import SheetItem from "../ui/SheetItem"

import useResponsiveSheetMenu from "../../hooks/useResponsiveSheetMenu"

import "../../styles/components/MediaEditMenu.css"

function MediaEditMenu({ isOpen, onClose, onUpload, onRemove, hasImage, title, anchorRef, maxSize }) {
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
    } = useResponsiveSheetMenu({ isOpen, onClose, anchorRef, scrollLockClass: "media-menu-open" })

    function handleUpload() {
        onUpload()
        handleDone()
    }

    function handleRemove() {
        onRemove()
        handleDone()
    }
    
    if (!isOpen) return null

    if (isMobile) {
        return (
            <>
                <div 
                    className={`media-menu-overlay ${isClosing ? "media-menu-overlay--out" : ""}`}
                    onClick={triggerClose} 
                />

                <div 
                    className={`media-menu-sheet ${isClosing ? "media-menu-sheet--closing" : ""}`}
                    ref={sheetRef}
                    {...dragHandlers}
                    style={{
                        transform: `translateY(${translateY}px)`,
                        transition: isDragging ? "none" : undefined
                    }}
                >
                    <div className="media-menu-handle-area">
                        <div className="media-menu-handle" />
                    </div>

                    <h3 className="media-menu-title">{title}</h3>

                    <Section className="media-menu-row-container">
                        <SettingsCard>
                            <SheetItem 
                                label="Upload Image"
                                onClick={handleUpload}
                                text={`Upload a PNG, JPG, JPG or GIF under ${maxSize}MB.`}
                            />

                            <SheetItem 
                                label={`Remove ${title}`}
                                onClick={handleRemove}
                                variant="danger"
                            />
                        </SettingsCard>
                    </Section>
                </div>
            </>
        )
    }

    return (
        <div 
            className="media-menu-dropdown"
            ref={menuRef}
        >
            <button 
                className="media-menu-row" 
                onClick={handleUpload}
            >
                Upload Image
            </button>

            {hasImage && (
                <button 
                    className="media-menu-row media-menu-row--danger" 
                    onClick={handleRemove}
                >
                    Remove {title}
                </button>
            )}
        </div>
    )
}

export default MediaEditMenu