import { useRef, useEffect, useState } from "react"

const DEFAULT_DRAG_THRESHOLD = 8 // before it counts as a drag, not a tap
const DEFAULT_DISMISS_THRESHOLD = 100 // before it triggers a close
const DEFAULT_CLOSE_DURATION = 250

function useDraggableSheet({ onClose, dragThreshold = DEFAULT_DRAG_THRESHOLD, dismissThreshold = DEFAULT_DISMISS_THRESHOLD, closeDuration = DEFAULT_CLOSE_DURATION }) {
    const sheetRef = useRef(null)
    const dragStartRef = useRef(null)
    const dragEngagedRef = useRef(false)
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
        setTimeout(onClose, closeDuration)
    }

    function handlePointerDown(e) {
        dragStartRef.current = e.clientY
        currentTranslateRef.current = 0
        dragEngagedRef.current = false
    }

    function handlePointerMove(e) {
        if (dragStartRef.current === null) return

        // downward drag
        const delta = e.clientY - dragStartRef.current

        if (!dragEngagedRef.current) {
            if (Math.abs(delta) < dragThreshold) return // could still be just a tap
        
            dragEngagedRef.current = true
            setIsDragging(true)
            e.currentTarget.setPointerCapture(e.pointerId)
        }

        // upward drag (rubber band effect)
        const next = delta < 0 ? Math.max(delta / 3, -40) : delta

        currentTranslateRef.current = next
        setTranslateY(next)
    }

    function handlePointerUp() {
        const wasDragging = dragEngagedRef.current

        dragStartRef.current = null
        dragEngagedRef.current = false
        setIsDragging(false)

        if (!wasDragging) return

        if (currentTranslateRef.current > dismissThreshold) {
            triggerClose()
        } else {
            setTranslateY(0)
        }
    }

    // reset drag state
    function reset() {
        setTranslateY(0)
        setIsClosing(false)
    }

    return {
        sheetRef,
        translateY,
        isDragging,
        isClosing,
        triggerClose,
        reset,
        dragHandlers: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp
        }
    }
}

export default useDraggableSheet