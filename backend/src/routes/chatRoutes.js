import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { askBlossom } from "../controllers/chatController.js"

const router = express.Router()

router.post("/ask", authMiddleware, askBlossom)

export default router