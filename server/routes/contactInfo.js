import express from "express"
import ContactInfo from "../models/contactInfo.js"
import auth from "../middleware/auth.js"

const router = express.Router()

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
      contactInfo = new ContactInfo(req.body)
    } else {
      Object.assign(contactInfo, req.body)
    }

    await contactInfo.save()
    res.json({ success: true, contactInfo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
