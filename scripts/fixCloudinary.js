import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: "dr3byncpo",
  api_key: "894761112631794",
  api_secret: "ZeBVUSHkNnQus4J1339kmt9W0Kw",
})

const fixResumeAccess = async () => {
  try {
    const result = await cloudinary.uploader.explicit("portfolio/resumes/resume-0e660f02-f653-4f9e-b849-3ac5e3f505f1", {
      type: "upload",
      access_mode: "public",
    }, { resource_type: "raw" })

    console.log("Success:", result)
    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

fixResumeAccess()