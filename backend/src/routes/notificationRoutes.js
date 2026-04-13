import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getNotifications, createNotification, markAsRead } from "../controllers/notificationController.js"

const router = express.Router()

router.get("/", authMiddleware, getNotifications)
router.post("/", authMiddleware, createNotification)
router.patch("/:id", authMiddleware, markAsRead)

export default router