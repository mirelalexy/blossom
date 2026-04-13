import express from "express"
import cors from "cors"

import pool from "./db.js"
import authRoutes from "./routes/authRoutes.js"
import { authMiddleware } from "./middleware/authMiddleware.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import goalRoutes from "./routes/goalRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"
import categoryBudgetRoutes from "./routes/categoryBudgetRoutes.js"
import ruleRoutes from "./routes/ruleRoutes.js"
import notificationSettingsRoutes from "./routes/notificationSettingsRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.get("/", (req, res) => {
    res.send("API is running")
})

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: "You are authenticated", userId: req.userId })
})

pool.query("SELECT NOW()")
    .then(res => console.log("DB connected:", res.rows[0]))
    .catch(err => console.log("DB error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/goals", goalRoutes)
app.use("/api/budget", budgetRoutes)
app.use("/api/category-budgets", categoryBudgetRoutes)
app.use("/api/rules", ruleRoutes)
app.use("/api/notification-settings", notificationSettingsRoutes)
app.use("/api/notifications", notificationRoutes)

export default app