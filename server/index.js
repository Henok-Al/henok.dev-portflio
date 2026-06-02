import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dbConnect } from "./config/dbConnect.js"
import configureCloudinary from "./config/cloudinary.js"

// Import routes
import authRoutes from "./routes/auth.js"
import projectRoutes from "./routes/projects.js"
import aboutRoutes from "./routes/about.js"
import skillRoutes from "./routes/skills.js"
import workExperienceRoutes from "./routes/workExperience.js"
import contactInfoRoutes from "./routes/contactInfo.js"
import uploadRoutes from "./routes/upload.js"
import messageRoutes from "./routes/messages.js"
import achievementRoutes from "./routes/achievements.js"
import { existsSync } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || "development"
const envFile = path.resolve(__dirname, "..", `.env.${env}`)
existsSync(envFile)
  ? dotenv.config({ path: envFile })
  : dotenv.config({ path: path.resolve(__dirname, "..", ".env") })

// Validate required env vars
const requiredEnvVars = ["DB", "JWT_SECRET"]
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

// Unhandled rejection/exception handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

const app = express()
const port = process.env.PORT || 5000

if (env === "production") {
  app.set("trust proxy", 1)
}

app.use(express.json({ limit: "10kb" }))

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/about", aboutRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/work-experience", workExperienceRoutes)
app.use("/api/contact-info", contactInfoRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/achievements", achievementRoutes)

if (env === "production") {
  app.use(
    express.static(path.join(__dirname, "..", "dist"), {
      maxAge: "1y",
      etag: true,
    }),
  )

  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "..", "dist", "index.html")),
  )
}

// Connect to DB, configure services, then start server
const startServer = async () => {
  try {
    await dbConnect()
    configureCloudinary()

    const server = app.listen(port, () => {
      console.log(`Server started successfully at port ${port}`)
      console.log(
        `Environment: ${env === "production" ? "production" : "development"}`,
      )
    })

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`)
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("Server closed.")
          process.exit(0)
        })
      })
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"))
    process.on("SIGINT", () => shutdown("SIGINT"))
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
