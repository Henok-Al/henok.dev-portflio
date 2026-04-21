import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    technologies: [
      {
        name: String,
        icon: String,
      },
    ],
    githubUrl: {
      type: String,
      required: true,
    },
    liveUrl: {
      type: String,
      default: "",
    },
    youtubeUrl: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        default: [],
      },
    ],
    videos: [
      {
        type: String,
        default: [],
      },
    ],
    features: [
      {
        type: String,
        default: [],
      },
    ],
    collaborators: [
      {
        type: String,
        default: [],
      },
    ],
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "on-hold"],
      default: "completed",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    githubData: {
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      language: { type: String, default: "" },
      lastUpdated: { type: Date, default: Date.now },
    },
    githubStats: {
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      language: { type: String, default: "" },
      lastUpdated: { type: Date, default: Date.now },
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

export default mongoose.model("Project", projectSchema)
