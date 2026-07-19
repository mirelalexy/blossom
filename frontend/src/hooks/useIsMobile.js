import { useEffect, useState } from "react"

const BREAKPOINT = "(max-width: 1023px)"

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.matchMedia(BREAKPOINT).matches
    )

    useEffect(() => {
        const mediaQuery = window.matchMedia(BREAKPOINT)

        function handleChange(e) {
            setIsMobile(e.matches)
        }

        mediaQuery.addEventListener("change", handleChange)
        
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    return isMobile
}

export default useIsMobile
