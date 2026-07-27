import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { chatRateLimiter } from "../middleware/chatRateLimiter.js"
import { askBlossom } from "../controllers/chatController.js"

const router = express.Router()

router.post("/ask", authMiddleware, chatRateLimiter, askBlossom)

export default router