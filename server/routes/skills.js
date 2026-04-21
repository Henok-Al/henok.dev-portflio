import express from "express"
import Skill from "../models/skill.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all skills (public)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isVisible: true }

    if (category) {
      filter.category = category
    }

    const skills = await Skill.find(filter).sort({ order: 1, name: 1 })
    res.json({ success: true, skills })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get skills grouped by category (public)
router.get("/grouped", async (req, res) => {
  try {
    const skills = await Skill.find({ isVisible: true }).sort({
      order: 1,
      name: 1,
    })

    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})

    res.json({ success: true, skills: groupedSkills })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Admin routes

// Get all skills for admin
router.get("/admin/all", auth, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 })
    res.json({ success: true, skills })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create skill
router.post("/", auth, async (req, res) => {
  try {
    const skillData = {
      ...req.body,
      icon:
        req.body.icon && !req.body.icon.startsWith("http")
          ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/" +
            req.body.icon
          : req.body.icon,
    }

    const skill = new Skill(skillData)
    await skill.save()
    res.status(201).json({ success: true, skill })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update skill
router.put("/:id", auth, async (req, res) => {
  try {
    const updateData = { ...req.body }

    // Transform icon key to full URL if icon is provided
    if (updateData.icon && !updateData.icon.startsWith("http")) {
      updateData.icon =
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/" +
        updateData.icon
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" })
    }
    res.json({ success: true, skill })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete skill
router.delete("/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" })
    }
    res.json({ success: true, message: "Skill deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
