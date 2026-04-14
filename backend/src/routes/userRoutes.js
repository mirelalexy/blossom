import express from "express"
import upload from "../middleware/upload.js"

import { getCurrentUser, updateUserSettings, uploadAvatar, uploadBanner, changePassword } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/me", authMiddleware, getCurrentUser)
router.put("/settings", authMiddleware, updateUserSettings)
router.post("/avatar", authMiddleware, upload.single("image"), uploadAvatar)
router.post("/banner", authMiddleware, upload.single("image"), uploadBanner)
router.patch("/password", authMiddleware, changePassword)

export default router
