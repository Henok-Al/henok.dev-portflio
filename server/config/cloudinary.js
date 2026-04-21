import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  // Verify configuration
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn(
      "⚠️  Cloudinary configuration is incomplete. Please check your environment variables.",
    )
    return false
  }

  console.log("✅ Cloudinary configured successfully")
  return true
}

export default configureCloudinary
