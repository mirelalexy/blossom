const WINDOW_MS = 60 * 1000 // 1 minute window
const lastResendAt = new Map() // email with timestamp

export function resendVerificationLimiter(req, res, next) {
    const { email } = req.body
    if (!email) return next()

    const now = Date.now()
    const lastSent = lastResendAt.get(email)

    if (lastSent && now - lastSent < WINDOW_MS) {
        const waitSeconds = Math.ceil((WINDOW_MS - (now - lastSent)) / 1000)

        return res.status(429).json({
            error: `Please wait ${waitSeconds}s before requesting another link.`
        })
    }

    lastResendAt.set(email, now)
    next()
}

// clear out entries no longer needed
// use unref() to stop the timer from keeping the Node process alive by itself
setInterval(() => {
    const now = Date.now()

    for(const [email, timestamp] of lastResendAt.entries()) {
        // free memory if difference is longer than 1 minute
        if (now - timestamp > WINDOW_MS) {
            lastResendAt.delete(email)
        }
    }
}, WINDOW_MS).unref()