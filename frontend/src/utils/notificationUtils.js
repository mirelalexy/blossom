export function groupNotifications(notifications) {
    const today = []
    const yesterday = []
    const older = []

    const now = new Date()
    const day = 24 * 60 * 60 * 1000

    notifications.forEach(n => {
        const date = new Date(n.createdAt)
        const diff = now - date

        if (diff < day) {
            today.push(n)
        } else if (diff < day * 2) {
            yesterday.push(n)
        } else {
            older.push(n)
        }
    })

    return { today, yesterday, older }
}