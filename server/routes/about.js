import express from "express"
import About from "../models/about.js"
import auth from "../middleware/auth.js"

const router = express.Router()

const ABOUT_FIELDS = [
  "name",
  "title",
  "description",
  "bio",
  "socialLinks",
  "profileImage",
  "resumeUrl",
  "isActive",
]

const pickAllowed = (body) => {
  const picked = {}
  for (const key of ABOUT_FIELDS) {
    if (body[key] !== undefined) {
      picked[key] = body[key]
    }
  }
  return picked
}

// Get about info (public)
router.get("/", async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true })

    if (!about) {
      about = new About({
        name: "Henok Alemu",
        title: "Full Stack Developer",
        description:
          "Passionate developer with expertise in modern web technologies",
        bio: "I am a dedicated full-stack developer with a passion for creating innovative web solutions.",
        socialLinks: {
          github: "",
          linkedin: "",
          twitter: "",
          email: "",
        },
        isActive: true,
      })
      await about.save()
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
      about = new About(pickAllowed(req.body))
    } else {
      Object.assign(about, pickAllowed(req.body))
    }

    await about.save()
    res.json({ success: true, about })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
