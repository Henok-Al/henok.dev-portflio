import mongoose from "mongoose"
import dotenv from "dotenv"
import About from "../server/models/about.js"

dotenv.config()

const clearResumeUrl = async () => {
  try {
    const MONGO_URI = process.env.DB || process.env.MONGO_URI
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    const about = await About.findOne({ isActive: true })
    if (about) {
      about.resumeUrl = ""
      await about.save()
      console.log("Resume URL cleared successfully!")
    } else {
      console.log("No about info found")
    }

    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

clearResumeUrl()