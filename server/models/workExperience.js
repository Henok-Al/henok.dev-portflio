import mongoose from "mongoose"

const workExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null, // null means current job
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    achievements: [
      {
        type: String,
      },
    ],
    companyLogo: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("WorkExperience", workExperienceSchema)
