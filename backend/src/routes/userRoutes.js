import express from "express"
import multer from "multer"
import upload from "../middleware/upload.js"

import { getCurrentUser, updateUserSettings, uploadAvatar, uploadBanner, changePassword } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/me", authMiddleware, getCurrentUser)
router.put("/settings", authMiddleware, updateUserSettings)

router.post("/avatar", authMiddleware, (req, res) => {
    upload.single("image")(req, res, function (err) {
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
    upload.single("image")(req, res, function (err) {
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

export default router
