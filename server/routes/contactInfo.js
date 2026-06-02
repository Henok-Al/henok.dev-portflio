import express from "express"
import ContactInfo from "../models/contactInfo.js"
import auth from "../middleware/auth.js"

const router = express.Router()

const CONTACT_FIELDS = [
  "phone",
  "email",
  "address",
  "city",
  "country",
  "socialLinks",
  "isActive",
]

const pickAllowed = (body) => {
  const picked = {}
  for (const key of CONTACT_FIELDS) {
    if (body[key] !== undefined) {
      picked[key] = body[key]
    }
  }
  return picked
}

// Get contact info (public)
router.get("/", async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne({ isActive: true })
    if (!contactInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Contact info not found" })
    }
    res.json({ success: true, contactInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update contact info (admin)
router.put("/", auth, async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne({ isActive: true })

    if (!contactInfo) {
      contactInfo = new ContactInfo(pickAllowed(req.body))
    } else {
      Object.assign(contactInfo, pickAllowed(req.body))
    }

    await contactInfo.save()
    res.json({ success: true, contactInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
