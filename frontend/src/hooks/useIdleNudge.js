import { useEffect, useRef } from "react"
import { pickVoice } from "../utils/voice"
import { getEvilIdleMessage } from "../utils/evilBlossom"

export default function useIdleNudge({
    delay = 12000,
    enabled = true,
    hasInteracted,
    onTrigger
}) {
    const timerRef = useRef(null)

    useEffect(() => {
        if (!enabled) return

        // clear previous timer
        clearTimeout(timerRef.current)

        // start new timer after interaction resets
        timerRef.current = setTimeout(() => {
            const message = pickVoice(
                "Take your time.",
                getEvilIdleMessage()
            )

            onTrigger(message)
        }, delay)

        return () => clearTimeout(timerRef.current)
    }, [hasInteracted, enabled])
}