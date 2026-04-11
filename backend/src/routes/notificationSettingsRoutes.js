import express from "express"

import { getNotificationSettings, updateNotificationSettings } from "../controllers/notificationSettingsController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getNotificationSettings)
router.put("/", authMiddleware, updateNotificationSettings)

export default router
