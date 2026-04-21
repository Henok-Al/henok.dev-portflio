import express from "express"
import About from "../models/about.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get about info (public)
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true })
    if (!about) {
      return res
        .status(404)
        .json({ success: false, message: "About info not found" })
    }
    res.json({ success: true, about })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update about info (admin)
router.put("/", auth, async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true })

    if (!about) {
      about = new About(req.body)
    } else {
      Object.assign(about, req.body)
    }

    await about.save()
    res.json({ success: true, about })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
