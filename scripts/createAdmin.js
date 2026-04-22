import mongoose from "mongoose"
import Admin from "../server/models/admin.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config({ path: process.cwd() + "/.env" })

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const adminData = {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "henok.dev@admin.com",
      password: process.env.ADMIN_PASSWORD || "Hen!y@2119",
      githubUsername: process.env.ADMIN_GITHUB_USERNAME || "henokgebresenbet",
    }

    // Check if admin exists
    let admin = await Admin.findOne({})

    if (admin) {
      // Update existing admin
      admin.username = adminData.username
      admin.email = adminData.email
      if (adminData.password) {
        admin.password = await bcrypt.hash(adminData.password, 12)
      }
      admin.githubUsername = adminData.githubUsername
      await admin.save()
      console.log("Admin updated successfully!")
    } else {
      // Create new admin
      admin = new Admin(adminData)
      await admin.save()
      console.log("Admin created successfully!")
    }

    console.log("Username:", adminData.username)
    console.log("Email:", adminData.email)
    console.log("GitHub Username:", adminData.githubUsername)
    console.log("Password:", adminData.password.replace(/./g, "*"))

    process.exit(0)
  } catch (error) {
    console.error("Error creating/updating admin:", error)
    process.exit(1)
  }
}

createAdmin()
