import express from "express"
import {
  upload,
  saveProfileImage,
  saveResume,
  saveProjectAsset,
  saveAchievementImage,
  deleteFile,
  getFileInfo,
} from "../utils/cloudinaryUpload.js"
import { v2 as cloudinary } from "cloudinary"
import auth from "../middleware/auth.js"
import About from "../models/about.js"

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dr3byncpo",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const router = express.Router()

// Upload profile image
router.post(
  "/profile-image",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" })
      }

      // Save the new image
      const imageUrl = await saveProfileImage(
        req.file.buffer,
        req.file.originalname,
      )

      // Get current about info to delete old image
      const aboutInfo = await About.findOne({ isActive: true })
      const oldImageUrl = aboutInfo?.profileImage

      // Update about info with new image URL
      if (aboutInfo) {
        aboutInfo.profileImage = imageUrl
        await aboutInfo.save()
      } else {
        await About.create({
          name: "Your Name",
          title: "Your Title",
          description: "Your Description",
          bio: "Your Bio",
          profileImage: imageUrl,
          isActive: true,
        })
      }

      // Delete old image if it exists and is from Cloudinary
      if (oldImageUrl && oldImageUrl.includes("cloudinary.com")) {
        await deleteFile(oldImageUrl)
      }

      res.json({
        success: true,
        message: "Profile image uploaded successfully",
        imageUrl: imageUrl,
      })
    } catch (error) {
      console.error("Error uploading profile image:", error)
      res.status(500).json({ success: false, message: error.message })
    }
  },
)

// Upload resume
router.post("/resume", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" })
    }

    // Save the new resume
    const resumeUrl = await saveResume(req.file.buffer, req.file.originalname)

    // Get current about info to delete old resume
    const aboutInfo = await About.findOne({ isActive: true })
    const oldResumeUrl = aboutInfo?.resumeUrl

    // Update about info with new resume URL
    if (aboutInfo) {
      aboutInfo.resumeUrl = resumeUrl
      await aboutInfo.save()
    } else {
      await About.create({
        name: "Your Name",
        title: "Your Title",
        description: "Your Description",
        bio: "Your Bio",
        resumeUrl: resumeUrl,
        isActive: true,
      })
    }

    // Delete old resume if it exists and is from Cloudinary
    if (oldResumeUrl && oldResumeUrl.includes("cloudinary.com")) {
      await deleteFile(oldResumeUrl)
    }

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: resumeUrl,
    })
  } catch (error) {
    console.error("Error uploading resume:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Upload project asset (image or video)
router.post(
  "/project-assets",
  auth,
  upload.single("projectAsset"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" })
      }

      // Determine file type
      const fileType = req.file.mimetype.startsWith("video/")
        ? "video"
        : "image"

      // Save the new project asset
      const assetUrl = await saveProjectAsset(
        req.file.buffer,
        req.file.originalname,
        fileType,
      )

      res.json({
        success: true,
        message: `Project ${fileType} uploaded successfully`,
        assetUrl: assetUrl,
        fileType: fileType,
      })
    } catch (error) {
      console.error("Error uploading project asset:", error)
      res.status(500).json({ success: false, message: error.message })
    }
  },
)

// Upload achievement image
router.post(
  "/achievement-image",
  auth,
  upload.single("achievementImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" })
      }

      // Save the achievement image
      const imageUrl = await saveAchievementImage(
        req.file.buffer,
        req.file.originalname,
      )

      res.json({
        success: true,
        message: "Achievement image uploaded successfully",
        url: imageUrl,
      })
    } catch (error) {
      console.error("Error uploading achievement image:", error)
      res.status(500).json({ success: false, message: error.message })
    }
  },
)

// Delete file
router.delete("/file", auth, async (req, res) => {
  try {
    const { filePath, type } = req.body

    if (!filePath) {
      return res
        .status(400)
        .json({ success: false, message: "File path is required" })
    }

    const deleted = await deleteFile(filePath)

    if (deleted) {
      // If it's a profile image or resume, update the about info
      if (type === "profile" || type === "resume") {
        const aboutInfo = await About.findOne({ isActive: true })
        if (aboutInfo) {
          if (type === "profile") {
            aboutInfo.profileImage = "" // Reset to default
          } else if (type === "resume") {
            aboutInfo.resumeUrl = "" // Reset to default
          }
          await aboutInfo.save()
        }
      }

      res.json({
        success: true,
        message: "File deleted successfully",
      })
    } else {
      res.status(404).json({
        success: false,
        message: "File not found or could not be deleted",
      })
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get file info
router.get("/file-info", auth, async (req, res) => {
  try {
    const { filePath } = req.query

    if (!filePath) {
      return res
        .status(400)
        .json({ success: false, message: "File path is required" })
    }

    const fileInfo = await getFileInfo(filePath)

    res.json({
      success: true,
      fileInfo: fileInfo,
    })
  } catch (error) {
    console.error("Error getting file info:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// List uploaded files
router.get("/files", auth, async (req, res) => {
  try {
    const aboutInfo = await About.findOne({ isActive: true })

    const files = {
      profileImage: {
        url: aboutInfo?.profileImage,
        isUploaded:
          aboutInfo?.profileImage?.includes("cloudinary.com") || false,
      },
      resume: {
        url: aboutInfo?.resumeUrl,
        isUploaded: aboutInfo?.resumeUrl?.includes("cloudinary.com") || false,
      },
    }

    res.json({
      success: true,
      files: files,
    })
  } catch (error) {
    console.error("Error listing files:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Download resume
router.get("/download", async (req, res) => {
  try {
    const aboutInfo = await About.findOne({ isActive: true })
    
    if (!aboutInfo?.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not found" })
    }
    
    // If it's a Cloudinary URL, redirect with proper handling
    if (aboutInfo.resumeUrl.includes("cloudinary.com")) {
      // Use Cloudinary's signed URL for download
      const cloudinary = require("cloudinary").v2
      const publicId = aboutInfo.resumeUrl.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "")
      
      const options = {
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
        attachment: false,
      }
      
      const signedUrl = cloudinary.utils.download_private_resource(publicId, options)
      res.redirect(signedUrl)
    } else {
      res.redirect(aboutInfo.resumeUrl)
    }
  } catch (error) {
    console.error("Error downloading resume:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Download resume - fetch and serve through server
router.get("/download", async (req, res) => {
  try {
    const aboutInfo = await About.findOne({ isActive: true })

    if (!aboutInfo?.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not found" })
    }

    // Use the Cloudinary URL directly - fetch and stream to client
    const resumeUrl = aboutInfo.resumeUrl

    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `inline; filename="${aboutInfo.name || 'Resume'}.pdf"`)

    // Redirect to Cloudinary URL - browsers can display PDFs from cloudinary
    res.redirect(303, resumeUrl)
  } catch (error) {
    console.error("Error downloading resume:", error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Download resume - fetch through server with credentials
router.get("/resume/download", async (req, res) => {
  try {
    const aboutInfo = await About.findOne({ isActive: true })

    if (!aboutInfo?.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" })
    }

    // Use the direct URL - Cloudinary needs authentication for raw files
    // Let's create a signed URL
    const cloudinary = require("cloudinary").v2

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dr3byncpo",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Extract public ID from URL
    const urlParts = aboutInfo.resumeUrl.split("/upload/")
    let publicId = urlParts[1]
    if (publicId) {
      publicId = publicId.replace(/^v\d+\//, "").replace(/\.pdf$/, "")
    }

    // Generate signed URL
    const signParams = {
      timestamp: Math.floor(Date.now() / 1000),
      public_id: publicId,
      resource_type: "raw",
      format: "pdf",
    }

    const signature = cloudinary.utils.api_sign_request(signParams, process.env.CLOUDINARY_API_SECRET)

    const downloadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.pdf?api_key=${process.env.CLOUDINARY_API_KEY}&timestamp=${signParams.timestamp}&signature=${signature}&resource_type=raw`

    res.redirect(downloadUrl)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Download resume - use Cloudinary SDK with API credentials (public route)
router.get("/resume/download", async (req, res) => {
  try {
    const aboutInfo = await About.findOne({ isActive: true })
    if (!aboutInfo?.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" })
    }

    // Use the API to get the raw file
    const result = await cloudinary.api.resource(aboutInfo.resumeUrl.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, ""), {
      resource_type: "raw",
    })

    // Redirect to the secure URL which now works with API credentials
    res.redirect(result.secure_url)
  } catch (error) {
    console.error("Error:", error)
    // Try fetching if API fails - use direct URL
    try {
      const response = await fetch(aboutInfo.resumeUrl)
      if (!response.ok) throw new Error("Fetch failed")
      const blob = await response.blob()
      res.setHeader("Content-Type", "application/pdf")
      res.send(blob)
    } catch (e) {
      console.error("Fetch error:", e)
      res.status(500).json({ message: error.message })
    }
  }
})

export default router
