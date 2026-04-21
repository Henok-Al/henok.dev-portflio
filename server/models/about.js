import mongoose from "mongoose"

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Krishna Jain",
    },
    title: {
      type: String,
      required: true,
      default: "Full Stack Developer",
    },
    description: {
      type: String,
      required: true,
      default: "Passionate developer with expertise in modern web technologies",
    },
    bio: {
      type: String,
      required: true,
      default:
        "I am a dedicated full-stack developer with a passion for creating innovative web solutions.",
    },
    profileImage: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("About", aboutSchema)
