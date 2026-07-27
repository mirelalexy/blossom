const WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS = 10 // per user, per window

const requestLog = new Map() // each user has a count and a window start

export function chatRateLimiter(req, res, next) {
    const userId = req.user.userId
    const now = Date.now()

    const entry = requestLog.get(userId)

    // start fresh if user has no entry or previous window has expired
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        requestLog.set(userId, {
            count: 1,
            windowStart: now
        })

        return next()
    }

    if (entry.count >= MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000)
        res.set("Retry-After", String(retryAfterSeconds))

        return res.status(429).json({
            error: "You're asking a lot at once. Give it a moment and try again.",
            retryAfter: retryAfterSeconds
        })
    }

    entry.count += 1
    next()
}

// clear out entries no longer needed
// use unref() to stop the timer from keeping the Node process alive by itself
setInterval(() => {
    const now = Date.now()

    for(const [userId, entry] of requestLog.entries()) {
        // free memory if difference is longer than 1 minute
        if (now - entry.windowStart > WINDOW_MS) {
            requestLog.delete(userId)
        }
    }
}, WINDOW_MS).unref()