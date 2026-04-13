import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getChallenges } from "../controllers/challengeController.js"

const router = express.Router()

router.get("/", authMiddleware, getChallenges)

export default router