import { isEvilMode } from "./evilBlossom"

export function getVoice() {
    return isEvilMode() ? "evil" : "default"
}

export function pickVoice(defaultText, evilText) {
    return getVoice() === "evil" ? evilText : defaultText
}