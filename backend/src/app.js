import express from "express"
import cors from "cors"

import pool from "./db.js"
import authRoutes from "./routes/authRoutes.js"
import { authMiddleware } from "./middleware/authMiddleware.js"
import transactionRoutes from "./routes/transactionRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

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

export default app