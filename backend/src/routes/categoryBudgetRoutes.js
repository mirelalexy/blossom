import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getCategoryBudgets, upsertCategoryBudget } from "../controllers/categoryBudgetController.js"

const router = express.Router()

router.get("/", authMiddleware, getCategoryBudgets)
router.put("/:categoryId", authMiddleware, upsertCategoryBudget)

export default router