import pool from "../db.js"
import { getDataSlice } from "../utils/chatUtils.js"
import { buildProactivePrompt, NO_INSIGHT_FOUND } from "../config/prompts.js"

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
const MODEL = "claude-sonnet-5"
const MIN_DAYS_BETWEEN_INSIGHTS = 3
const BURST_THRESHOLD = 6

export async function generateProactiveInsight(userId, isEvil, tz = "UTC") {
    try {
        const dataSlice = await getDataSlice(userId, "recent patterns this month", tz)
        const prompt = buildProactivePrompt(dataSlice, isEvil)

        const response = await fetch(CLAUDE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.CLAUDE_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 200,
                thinking: { type: "disabled" },
                system: prompt,
                messages: [
                    { role: "user", content: "Is there anything worth noticing right now?" }
                ]
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("Claude API error (proactive insight generation): ", response.status, errText)
            return null
        }

        const data = await response.json()

        // data content contains type and text fields
        const textBlock = data.content?.find((block) => block.type === "text")

        if (!textBlock) return null
        
        const text = textBlock.text

        return (!text || text === NO_INSIGHT_FOUND) ? null : text
    } catch (err) {
        console.error("Proactive insight generation error: ", err)
        return null
    }
}

export async function triggerProactiveInsight(userId, isEvil = false) {
    try {
        const userRes = await pool.query(
            `UPDATE users
            SET new_transactions_since_last_insight_check = new_transactions_since_last_insight_check + 1
            WHERE id = $1
            RETURNING last_insight_check_at, new_transactions_since_last_insight_check, timezone`,
            [userId]
        )

        const user = userRes.rows[0]

        const tz = user?.timezone || "UTC"
        const lastCheck = user?.last_insight_check_at
        const sinceCount = user?.new_transactions_since_last_insight_check

        const daysSince = lastCheck
            ? (Date.now() - new Date(lastCheck).getTime()) / (1000 * 60 * 60 * 24)
            : Infinity

        const meetsTimeFloor = daysSince >= MIN_DAYS_BETWEEN_INSIGHTS
        const meetsBurstThreshold = sinceCount >= BURST_THRESHOLD

        if (!meetsTimeFloor && !meetsBurstThreshold) return

        await pool.query(
            `UPDATE users 
            SET last_insight_check_at = NOW(), new_transactions_since_last_insight_check = 0
            WHERE id = $1`,
            [userId]
        )

        const insight = await generateProactiveInsight(userId, isEvil, tz)

        if (!insight) return

        await pool.query(
            `INSERT INTO proactive_insights (user_id, message) VALUES ($1, $2)`,
            [userId, insight]
        )
    } catch (err) {
        console.error("Trigger proactive insight failed: ", err)
    }
}