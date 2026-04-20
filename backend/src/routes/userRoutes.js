import express from "express"
import multer from "multer"
import { uploadAvatarMiddleware, uploadBannerMiddleware } from "../middleware/upload.js"

import { getCurrentUser, updateUserSettings, uploadAvatar, uploadBanner, changePassword, deleteAccount, resetApp } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/me", authMiddleware, getCurrentUser)
router.put("/settings", authMiddleware, updateUserSettings)

router.post("/avatar", authMiddleware, (req, res) => {
    uploadAvatarMiddleware.single("image")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ error: "File too large (max 5MB)" })
            }
        } else if (err) {
            return res.status(400).json({ error: err.message })
        }

        uploadAvatar(req, res)
    })
})

router.post("/banner", authMiddleware, (req, res) => {
    uploadBannerMiddleware.single("image")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ error: "File too large (max 5MB)" })
            }
        } else if (err) {
            return res.status(400).json({ error: err.message })
        }

        uploadBanner(req, res)
    })
})

router.patch("/password", authMiddleware, changePassword)
router.delete("/account", authMiddleware, deleteAccount)
router.post("/reset-app", authMiddleware, resetApp)

export default router
