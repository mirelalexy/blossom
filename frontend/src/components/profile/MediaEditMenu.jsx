import { useRef, useEffect } from "react"

import Section from "../ui/Section"
import SettingsCard from "../../components/settings/SettingsCard"
import SheetItem from "../ui/SheetItem"

import useIsMobile from "../../hooks/useIsMobile"

import "../../styles/components/MediaEditMenu.css"

function MediaEditMenu({ isOpen, onClose, onUpload, onRemove, hasImage, title, anchorRef, maxSize }) {
    const isMobile = useIsMobile()
    const menuRef = useRef(null)

    function handleUpload() {
        onUpload()
        onClose()
    }

    function handleRemove() {
        onRemove()
        onClose()
    }
    
    // on desktop, close on click outside or Esc key
    useEffect(() => {
        if (!isOpen || isMobile) return

        function handleClickOutside(e) {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                anchorRef.current && !anchorRef.current.contains(e.target)
            ) {
                onClose()
            }
        }

        function handleEscape(e) {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, isMobile, onClose, anchorRef])
    
    if (!isOpen) return null

    if (isMobile) {
        return (
            <>
                <div 
                    className="media-menu-overlay"
                    onClick={onClose} 
                />

                <div className="media-menu-sheet">
                    <div className="media-menu-handle" />

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