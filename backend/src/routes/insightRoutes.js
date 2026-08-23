import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getPendingInsight, markInsightSeen } from "../controllers/insightController.js"

const router = express.Router()

router.get("/pending", authMiddleware, getPendingInsight)
router.post("/:id/seen", authMiddleware, markInsightSeen)

export default router