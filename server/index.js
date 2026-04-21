import express from "express"
import dotenv from "dotenv"
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

const app = express()
const port = process.env.PORT || 5000

dbConnect()
configureCloudinary()

app.use(express.json())

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
  app.use(express.static(path.join(__dirname, "..", "dist")))

  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "..", "dist", "index.html")),
  )
}

app.listen(port, () => {
  console.log(`Server started successfully at port ${port}`)
  console.log(
    `Environment: ${env === "production" ? "production" : "development"}`,
  )
})
