import express from "express"
import Achievement from "../models/achievement.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all achievements (public)
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isVisible: true }).sort({
      order: 1,
      date: -1,
    })
    res.json({ success: true, achievements })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get achievements by category (public)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params
    const achievements = await Achievement.find({
      category,
      isVisible: true,
    }).sort({
      order: 1,
      date: -1,
    })
    res.json({ success: true, achievements })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get single achievement (public)
router.get("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement || !achievement.isVisible) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" })
    }
    res.json(achievement)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Admin routes (protected)

// Get all achievements for admin
router.get("/admin/all", auth, async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 })
    res.json({ success: true, achievements })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create achievement
router.post("/", auth, async (req, res) => {
  try {
    const achievement = new Achievement(req.body)
    await achievement.save()
    res.status(201).json({ success: true, achievement })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update achievement
router.put("/:id", auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" })
    }
    res.json({ success: true, achievement })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete achievement
router.delete("/:id", auth, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id)
    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" })
    }
    res.json({ success: true, message: "Achievement deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update achievement order
router.patch("/reorder", auth, async (req, res) => {
  try {
    const { achievements } = req.body

    for (let i = 0; i < achievements.length; i++) {
      await Achievement.findByIdAndUpdate(achievements[i]._id, { order: i })
    }

    res.json({
      success: true,
      message: "Achievement order updated successfully",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
