import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getRewards, createReward, updateReward, claimReward, deleteReward } from "../controllers/rewardController.js"

const router = express.Router()

router.get("/", authMiddleware, getRewards)
router.post("/", authMiddleware, createReward)
router.put("/:id", authMiddleware, updateReward)
router.patch("/:id/claim", authMiddleware, claimReward)
router.delete("/:id", authMiddleware, deleteReward)

export default router