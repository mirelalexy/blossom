import { useRef, useEffect } from "react"

import useIsMobile from "./useIsMobile"
import useDraggableSheet from "./useDraggableSheet"

// for menus that open as bottom sheets on mobile and anchored dropdowns on desktop
function useResponsiveSheetMenu({ isOpen, onClose, anchorRef, scrollLockClass }) {
    const isMobile = useIsMobile()
    const menuRef = useRef(null)

    const {
        sheetRef,
        translateY,
        isDragging,
        isClosing,
        triggerClose,
        reset,
        dragHandlers
    } = useDraggableSheet({ onClose })

    // reset drag state whenever the menu opens fresh
    useEffect(() => {
        if (isOpen) reset()
    }, [isOpen])

    // prevent page behind sheet from scrolling on mobile
    useEffect(() => {
        if (!isOpen || !isMobile || !scrollLockClass) return

        document.body.classList.add(scrollLockClass)

        return () => {
            document.body.classList.remove(scrollLockClass)
        }
    }, [isOpen, isMobile, scrollLockClass])

    // on desktop, close on click outside or Esc key
    useEffect(() => {
        if (!isOpen || isMobile) return

        function handleClickOutside(e) {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                anchorRef?.current && !anchorRef.current.contains(e.target)
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

    function handleDone() {
        isMobile ? triggerClose() : onClose()
    }

    return {
        isMobile,
        menuRef,
        sheetRef,
        translateY,
        isDragging,
        isClosing,
        triggerClose,
        dragHandlers,
        handleDone
    }
}

export default useResponsiveSheetMenu