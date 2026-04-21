import express from "express"
import jwt from "jsonwebtoken"
import Admin from "../models/admin.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Register admin (only for initial setup)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, githubUsername } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    })
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" })
    }

    const admin = new Admin({
      username,
      email,
      password,
      githubUsername,
    })

    await admin.save()

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        githubUsername: admin.githubUsername,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Login admin
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        githubUsername: admin.githubUsername,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get current admin
router.get("/me", auth, async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email,
      githubUsername: req.admin.githubUsername,
    },
  })
})

export default router
