import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getRules, createRule, updateRule, deleteRule } from "../controllers/ruleController.js"

const router = express.Router()

router.get("/", authMiddleware, getRules)
router.post("/", authMiddleware, createRule)
router.put("/:id", authMiddleware, updateRule)
router.delete("/:id", authMiddleware, deleteRule)

export default router