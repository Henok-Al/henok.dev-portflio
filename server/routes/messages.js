import express from "express"
import Message from "../models/message.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Public route - Create a new message (contact form submission)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, subject, message) are required",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      })
    }

    // Create new message
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    })

    await newMessage.save()

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        createdAt: newMessage.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating message:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Admin routes - Get all messages
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments()

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Admin route - Get a specific message
router.get("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      data: { message },
    })
  } catch (error) {
    console.error("Error fetching message:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Admin route - Delete a message
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Admin route - Mark message as read/unread
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { isRead } = req.body
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: Boolean(isRead) },
      { new: true },
    )

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    res.json({
      success: true,
      message: `Message marked as ${isRead ? "read" : "unread"}`,
      data: { message },
    })
  } catch (error) {
    console.error("Error updating message:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

export default router
