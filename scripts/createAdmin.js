import mongoose from "mongoose"
import Admin from "../server/models/admin.js"
import dotenv from "dotenv"

dotenv.config({ path: "env.production" })

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({})
    if (existingAdmin) {
      console.log("Admin already exists")
      process.exit(0)
    }

    // Create default admin
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || "admin",
      email: "krishnajain5050@gmail.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      githubUsername: "krishna4040", // Replace with your GitHub username
    })

    await admin.save()
    console.log("Admin created successfully!")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change these credentials after first login")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
