import express from "express"
import cors from "cors"

import pool from "./db.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("API is running")
})

pool.query("SELECT NOW()")
    .then(res => console.log("DB connected:", res.rows[0]))
    .catch(err => console.log("DB error:", err))

app.use("/api/auth", authRoutes)

export default app