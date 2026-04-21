import mongoose from "mongoose"

const contactInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    availability: {
      type: String,
      enum: ["available", "busy", "not-available"],
      default: "available",
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "linkedin", "any"],
      default: "email",
    },
    responseTime: {
      type: String,
      default: "24 hours",
    },
    workingHours: {
      timezone: { type: String, default: "UTC" },
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      website: { type: String, default: "" },
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

export default mongoose.model("ContactInfo", contactInfoSchema)
