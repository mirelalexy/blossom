import { useRef, useEffect, useState } from "react"

import Section from "../ui/Section"
import SettingsCard from "../../components/settings/SettingsCard"
import SheetItem from "../ui/SheetItem"

import useIsMobile from "../../hooks/useIsMobile"

import "../../styles/components/MediaEditMenu.css"

function MediaEditMenu({ isOpen, onClose, onUpload, onRemove, hasImage, title, anchorRef, maxSize }) {
    const isMobile = useIsMobile()
    const menuRef = useRef(null)

    // on mobile, drag to dismiss
    const sheetRef = useRef(null)
    const dragStartRef = useRef(null)
    const currentTranslateRef = useRef(0)

    const [translateY, setTranslateY] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    function triggerClose() {
        setIsClosing(true)

        const dismissDistance = sheetRef.current?.offsetHeight
            ? sheetRef.current.offsetHeight + 40
            : 400

        setTranslateY(dismissDistance)
        setTimeout(onClose, 250)
    }

    function handlePointerDown(e) {
        dragStartRef.current = e.clientY
        currentTranslateRef.current = 0
        setIsDragging(true)

        e.currentTarget.setPointerCapture(e.pointerId)
    }

    function handlePointerMove(e) {
        if (dragStartRef.current === null) return

        // downward drag
        const delta = e.clientY - dragStartRef.current

        // upward drag (rubber band effect)
        const next = delta < 0 ? Math.max(delta / 3, -40) : delta

        currentTranslateRef.current = next
        setTranslateY(next)
    }

    function handlePointerUp() {
        setIsDragging(false)
        dragStartRef.current = null

        if (currentTranslateRef.current > 100) {
            triggerClose()
        } else {
            setTranslateY(0)
        }
    }

    // reset drag state whenever the menu opens fresh
    useEffect(() => {
        if (isOpen) {
            setTranslateY(0)
            setIsClosing(false)
        }
    }, [isOpen])

    function handleUpload() {
        onUpload()
        isMobile ? triggerClose() : onClose()
    }

    function handleRemove() {
        onRemove()
        isMobile ? triggerClose() : onClose()
    }

    // prevent page behind sheet from scrolling
    useEffect(() => {
        if (!isOpen || !isMobile) return

        document.body.classList.add("media-menu-open")

        return () => {
            document.body.classList.remove("media-menu-open")
        }
    }, [isOpen, isMobile])
    
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
                    className={`media-menu-overlay ${isClosing ? "media-menu-overlay--out" : ""}`}
                    onClick={triggerClose} 
                />

                <div 
                    className={`media-menu-sheet ${isClosing ? "media-menu-sheet--closing" : ""}`}
                    ref={sheetRef}
                    style={{
                        transform: `translateY(${translateY}px)`,
                        transition: isDragging ? "none" : undefined
                    }}
                >
                    <div
                        className="media-menu-handle-area"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
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