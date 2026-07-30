import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { createCheckIn, getTodayCheckIn, updateCheckInNotes } from "../controllers/checkInController.js"

const router = express.Router()

router.post("/", authMiddleware, createCheckIn)
router.get("/today", authMiddleware, getTodayCheckIn)
router.patch("/today/notes", authMiddleware, updateCheckInNotes)

export default router