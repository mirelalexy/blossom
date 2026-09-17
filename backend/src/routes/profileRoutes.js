import express from "express"

import { getPeakStreak, getProfileStats } from "../controllers/profileController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/stats", authMiddleware, getProfileStats)
router.get("/peak", authMiddleware, getPeakStreak)

export default router
