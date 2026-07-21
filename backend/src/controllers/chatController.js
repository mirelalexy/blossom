import { getDataSlice } from "../utils/chatUtils.js"
import { buildSystemPrompt } from "../config/prompts.js"

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
const MODEL = "claude-sonnet-5"
const MAX_HISTORY_TURNS = 10

export async function askBlossom(req, res) {
    const userId = req.user.userId
    const { question, isEvil, conversationHistory } = req.body

    if (!question || !question.trim()) {
        return res.status(400).json({ error: "Question is required" })
    }

    try {
        const dataSlice = await getDataSlice(userId, question)
        const systemPrompt = buildSystemPrompt(dataSlice, isEvil)

        const history = Array.isArray(conversationHistory)
            ? conversationHistory.slice(-MAX_HISTORY_TURNS) // get last messages
            : []

        const messages = [
            ...history.map((m) => ({ role: m.role === "blossom" ? "assistant" : "user", content: m.text })),
            { role: "user", content: question }
        ]

        const response = await fetch(CLAUDE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.CLAUDE_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 400,
                thinking: { type: "disabled" },
                cache_control: { type: "ephemeral" },
                system: systemPrompt,
                messages
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("Claude API error: ", response.status, errText)
            return res.status(502).json({ error: "AI provider request failed" })
        }

        const data = await response.json()

        // data content contains type and text fields
        const textBlock = data.content?.find((block) => block.type === "text")

        if (!textBlock) {
            return res.status(502).json({ error: "No response generated" })
        }

        res.json({ response: textBlock.text })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Ask Blossom failed" })
    }
}