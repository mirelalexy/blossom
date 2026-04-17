import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from "../controllers/taskController.js"

const router = express.Router()

router.get("/", authMiddleware, getTasks)
router.post("/", authMiddleware, createTask)
router.put("/:id", authMiddleware, updateTask)
router.patch("/:id", authMiddleware, toggleTask)
router.delete("/:id", authMiddleware, deleteTask)

export default router