import { useProfile } from "../store/ProfileStore"
import { useChallenges } from "../store/ChallengeStore"
import { useNotifications } from "../store/NotificationStore"

export function useAppRefresh() {
    const { refreshStats } = useProfile()
    const { fetchChallenges } = useChallenges()
    const { fetchNotifications } = useNotifications()

    async function refreshApp() {
        await Promise.all([
            refreshStats(),
            fetchChallenges(),
            fetchNotifications()
        ])
    }

    return { refreshApp }
}