import { appIcons } from "../../utils/appIcons"

function Icon({ name, size = 25 }) {
    const LucideIcon = appIcons[name]

    if (!LucideIcon) return null

    return <LucideIcon size={size} />
}

export default Icon