import express from "express"

import { resendVerificationLimiter } from "../middleware/resendVerificationLimiter.js"
import { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", register)

router.post("/login", login)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.post("/verify-email", verifyEmail)

router.post("/resend-verification", resendVerificationLimiter, resendVerification)

export default router