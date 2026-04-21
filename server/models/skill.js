import mongoose from "mongoose"

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "frontend",
        "backend",
        "database",
        "tools",
        "cloud",
        "mobile",
        "other",
      ],
    },
    icon: {
      type: String,
      required: true,
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    description: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
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

export default mongoose.model("Skill", skillSchema)
