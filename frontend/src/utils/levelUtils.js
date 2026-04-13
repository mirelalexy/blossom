export function getLevelNarrative(level) {
    if (level >= 100) {
        return `This is no longer something you're trying to improve.
                Your habits are steady and your decisions feel natural.
                You're not chasing progress anymore...`
    }
    if (level >= 50) {
        return `There's a deep sense of control in your actions now.
                You understand your patterns, your impulses, and your priorities.
                What once required effort now feels natural, almost instinctive.`
    }
    if (level >= 30) {
        return `You've built something stable.
                Your habits aren't random anymore. They have become part of your routine, something you can rely on.
                There's a quiet strength in your consistency, and it shows in the way you make decisions.`
    }
    if (level >= 10) {
        return `Something has shifted.
                You pause more, think more, and act with a bit more intention.
                Your habits are starting to feel grounded, like they're becoming part of who you are.`
    }
    if (level >= 5) {
        return `You're beginning to notice your patterns.
                Some habits are forming, even if they're not perfect yet.`
    }

    return `You've just started paying attention and that matters more than it seems.
            Not everything feels clear yet, but something is shifting.
            Awareness is the first step, and you've already taken it.`
}