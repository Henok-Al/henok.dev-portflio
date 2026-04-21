import mongoose from "mongoose"

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["certification", "award", "recognition", "event", "achievement"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    organization: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    certificateUrl: {
      type: String,
      default: "",
    },
    credentialId: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        default: [],
      },
    ],
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

export default mongoose.model("Achievement", achievementSchema)
