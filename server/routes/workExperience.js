import express from "express"
import WorkExperience from "../models/workExperience.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all work experiences (public)
router.get("/", async (req, res) => {
  try {
    const experiences = await WorkExperience.find({ isVisible: true }).sort({
      startDate: -1,
      order: 1,
    })
    res.json({ success: true, experiences })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get single work experience (public)
router.get("/:id", async (req, res) => {
  try {
    const experience = await WorkExperience.findById(req.params.id)
    if (!experience || !experience.isVisible) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" })
    }
    res.json({ success: true, experience })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Admin routes

// Get all work experiences for admin
router.get("/admin/all", auth, async (req, res) => {
  try {
    const experiences = await WorkExperience.find().sort({ startDate: -1 })
    res.json({ success: true, experiences })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create work experience
router.post("/", auth, async (req, res) => {
  try {
    const experience = new WorkExperience(req.body)
    await experience.save()
    res.status(201).json({ success: true, experience })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update work experience
router.put("/:id", auth, async (req, res) => {
  try {
    const experience = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" })
    }
    res.json({ success: true, experience })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete work experience
router.delete("/:id", auth, async (req, res) => {
  try {
    const experience = await WorkExperience.findByIdAndDelete(req.params.id)
    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" })
    }
    res.json({ success: true, message: "Work experience deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
