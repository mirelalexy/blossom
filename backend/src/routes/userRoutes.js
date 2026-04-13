import express from "express"
import upload from "../middleware/upload.js"

import { getCurrentUser, updateUserSettings, uploadAvatar, uploadBanner } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/me", authMiddleware, getCurrentUser)
router.put("/settings", authMiddleware, updateUserSettings)
router.post("/avatar", upload.single("image"), uploadAvatar)
router.post("/banner", upload.single("image"), uploadBanner)

export default router
