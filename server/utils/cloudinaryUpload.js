import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"

// Storage configuration - using memory storage for Cloudinary
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage") {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed for profile picture"), false)
    }
  } else if (file.fieldname === "resume") {
    // Accept only PDFs
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed for resume"), false)
    }
  } else if (file.fieldname === "projectAsset") {
    // Accept images and videos for project assets
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true)
    } else {
      cb(
        new Error("Only image and video files are allowed for project assets"),
        false,
      )
    }
  } else if (file.fieldname === "achievementImage") {
    // Accept only images for achievements
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed for achievements"), false)
    }
  } else {
    cb(new Error("Invalid field name"), false)
  }
}

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for project assets (videos can be large)
  },
})

// Upload to Cloudinary with buffer
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
      .end(buffer)
  })
}

// Process and save profile image
export const saveProfileImage = async (buffer, originalName) => {
  try {
    const publicId = `portfolio/profiles/profile-${uuidv4()}`

    const result = await uploadToCloudinary(buffer, {
      public_id: publicId,
      transformation: [
        {
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face",
          quality: "auto:good",
          format: "jpg",
        },
      ],
      resource_type: "image",
    })

    return result.secure_url
  } catch (error) {
    throw new Error("Error processing profile image: " + error.message)
  }
}

// Save resume
export const saveResume = async (buffer, originalName) => {
  try {
    const publicId = `portfolio/resumes/resume-${uuidv4()}`

    const result = await uploadToCloudinary(buffer, {
      public_id: publicId,
      resource_type: "raw", // For non-image files like PDFs
      format: "pdf",
    })

    return result.secure_url
  } catch (error) {
    throw new Error("Error saving resume: " + error.message)
  }
}

// Process and save project asset (image or video)
export const saveProjectAsset = async (
  buffer,
  originalName,
  fileType = "image",
) => {
  try {
    const publicId = `portfolio/project-assets/${fileType}-${uuidv4()}`

    let uploadOptions = {
      public_id: publicId,
    }

    if (fileType === "image") {
      uploadOptions = {
        ...uploadOptions,
        transformation: [
          {
            width: 1200,
            height: 800,
            crop: "limit", // Don't crop, just resize if larger
            quality: "auto:good",
            format: "auto", // Auto-select best format (WebP, etc.)
          },
        ],
        resource_type: "image",
      }
    } else if (fileType === "video") {
      uploadOptions = {
        ...uploadOptions,
        transformation: [
          {
            width: 1280,
            height: 720,
            crop: "limit",
            quality: "auto:good",
          },
        ],
        resource_type: "video",
      }
    }

    const result = await uploadToCloudinary(buffer, uploadOptions)
    return result.secure_url
  } catch (error) {
    throw new Error(`Error processing project ${fileType}: ` + error.message)
  }
}

// Process and save achievement image
export const saveAchievementImage = async (buffer, originalName) => {
  try {
    const publicId = `portfolio/achievements/achievement-${uuidv4()}`

    const result = await uploadToCloudinary(buffer, {
      public_id: publicId,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "limit", // Don't crop, just resize if larger
          quality: "auto:good",
          format: "auto", // Auto-select best format (WebP, etc.)
        },
      ],
      resource_type: "image",
    })

    return result.secure_url
  } catch (error) {
    throw new Error("Error processing achievement image: " + error.message)
  }
}

// Delete file from Cloudinary
export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes("cloudinary.com")) {
      return false
    }

    // Extract public_id from Cloudinary URL
    const urlParts = fileUrl.split("/")
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"))

    if (versionIndex === -1) {
      return false
    }

    // Get the part after version (public_id with extension)
    const publicIdWithExt = urlParts.slice(versionIndex + 1).join("/")
    // Remove file extension to get public_id
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "")

    // Determine resource type based on folder
    let resourceType = "image"
    if (publicId.includes("resumes")) {
      resourceType = "raw"
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error)
    return false
  }
}

// Get file info from Cloudinary
export const getFileInfo = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes("cloudinary.com")) {
      return { exists: false }
    }

    // Extract public_id from Cloudinary URL
    const urlParts = fileUrl.split("/")
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"))

    if (versionIndex === -1) {
      return { exists: false }
    }

    const publicIdWithExt = urlParts.slice(versionIndex + 1).join("/")
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "")

    // Determine resource type based on folder
    let resourceType = "image"
    if (publicId.includes("resumes")) {
      resourceType = "raw"
    }

    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    })

    return {
      exists: true,
      size: result.bytes,
      modified: new Date(result.created_at),
      format: result.format,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    return { exists: false }
  }
}

// Helper function to extract public_id from Cloudinary URL
export const extractPublicId = (cloudinaryUrl) => {
  try {
    const urlParts = cloudinaryUrl.split("/")
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"))

    if (versionIndex === -1) {
      return null
    }

    const publicIdWithExt = urlParts.slice(versionIndex + 1).join("/")
    return publicIdWithExt.replace(/\.[^/.]+$/, "")
  } catch (error) {
    return null
  }
}
