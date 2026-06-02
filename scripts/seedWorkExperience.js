import mongoose from "mongoose"
import dotenv from "dotenv"
import WorkExperience from "../server/models/workExperience.js"

dotenv.config()

const workExperiences = [
  {
    position: "Fullstack Developer",
    company: "Solar Project",
    location: "Ethiopia",
    employmentType: "full-time",
    description:
      "As a full-stack developer, I developed a solar project using React.js for the frontend and Node.js with RESTful APIs for the backend, ensuring efficient solar energy tracking and monitoring.",
    startDate: new Date("2023-08-01"),
    endDate: null,
    order: 1,
    isVisible: true,
  },
  {
    position: "Fullstack Developer",
    company: "HabeshaNet",
    location: "Ethiopia",
    employmentType: "full-time",
    description:
      "As a full-stack developer, I focused on building REST APIs for backend while also contributing to the frontend for HabeshaNet, a social job boarding platform.",
    startDate: new Date("2023-08-01"),
    endDate: null,
    order: 2,
    isVisible: true,
  },
  {
    position: "Fullstack Developer",
    company: "St. Mary University",
    location: "Ethiopia",
    employmentType: "contract",
    description:
      "Final Year Project - Developed a full-stack application for the university.",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2023-07-01"),
    order: 3,
    isVisible: true,
  },
  {
    position: "UI/UX Design and Frontend Developer",
    company: "Atlas Computer Technology",
    location: "Ethiopia",
    employmentType: "part-time",
    description:
      "Web Design and Prototyping: Collaborated on website project (landing and blog pages) with Figma.",
    startDate: new Date("2022-07-01"),
    endDate: new Date("2022-09-01"),
    order: 4,
    isVisible: true,
  },
]

const seedWorkExperience = async () => {
  try {
    const MONGO_URI = process.env.DB || process.env.MONGO_URI
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    // Clear existing work experiences
    await WorkExperience.deleteMany({})
    console.log("Cleared existing work experiences")

    // Insert new work experiences
    await WorkExperience.insertMany(workExperiences)
    console.log(
      `Successfully seeded ${workExperiences.length} work experiences`,
    )

    process.exit(0)
  } catch (error) {
    console.error("Error seeding work experiences:", error)
    process.exit(1)
  }
}

seedWorkExperience()
