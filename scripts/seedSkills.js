import mongoose from "mongoose"
import dotenv from "dotenv"
import Skill from "../server/models/skill.js"

dotenv.config()

const MONGO_URI = process.env.DB || process.env.MONGO_URI

const skills = [
  // Frontend
  {
    name: "JavaScript",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    proficiency: 5,
    description: "Modern JavaScript for interactive web applications",
    yearsOfExperience: 5,
    isVisible: true,
    order: 1,
  },
  {
    name: "TypeScript",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    proficiency: 5,
    description: "Type-safe JavaScript superset",
    yearsOfExperience: 4,
    isVisible: true,
    order: 2,
  },
  {
    name: "ReactJS",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    proficiency: 5,
    description: "A JavaScript library for building user interfaces",
    yearsOfExperience: 5,
    isVisible: true,
    order: 3,
  },
  {
    name: "Next.js",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    proficiency: 4,
    description: "The React Framework for the Web",
    yearsOfExperience: 3,
    isVisible: true,
    order: 4,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    proficiency: 5,
    description: "A utility-first CSS framework",
    yearsOfExperience: 4,
    isVisible: true,
    order: 5,
  },
  {
    name: "MUI",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
    proficiency: 4,
    description: "Material UI - React component library",
    yearsOfExperience: 3,
    isVisible: true,
    order: 6,
  },
  {
    name: "React Native",
    category: "mobile",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    proficiency: 4,
    description: "Build native mobile apps with React",
    yearsOfExperience: 3,
    isVisible: true,
    order: 7,
  },
  {
    name: "Figma",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    proficiency: 4,
    description: "Collaborative interface design tool",
    yearsOfExperience: 3,
    isVisible: true,
    order: 8,
  },

  // Backend
  {
    name: "Node.js",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    proficiency: 5,
    description: "JavaScript runtime built on Chrome's V8 engine",
    yearsOfExperience: 5,
    isVisible: true,
    order: 9,
  },
  {
    name: "Express.js",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    proficiency: 5,
    description: "Fast, unopinionated web framework for Node.js",
    yearsOfExperience: 4,
    isVisible: true,
    order: 10,
  },
  {
    name: "PrismaORM",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
    proficiency: 4,
    description: "Next-generation Node.js and TypeScript ORM",
    yearsOfExperience: 2,
    isVisible: true,
    order: 11,
  },
  {
    name: "Drizzle ORM",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drizzle/drizzle-original.svg",
    proficiency: 3,
    description: "Lightweight TypeScript ORM",
    yearsOfExperience: 1,
    isVisible: true,
    order: 12,
  },

  // Database
  {
    name: "MongoDB",
    category: "database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    proficiency: 5,
    description: "NoSQL document database",
    yearsOfExperience: 5,
    isVisible: true,
    order: 13,
  },
  {
    name: "PostgreSQL",
    category: "database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    proficiency: 4,
    description: "Powerful, open source object-relational database",
    yearsOfExperience: 3,
    isVisible: true,
    order: 14,
  },

  // Tools & Cloud
  {
    name: "Git",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    proficiency: 5,
    description: "Distributed version control system",
    yearsOfExperience: 5,
    isVisible: true,
    order: 15,
  },
  {
    name: "GitHub",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    proficiency: 5,
    description: "Code hosting and collaboration platform",
    yearsOfExperience: 5,
    isVisible: true,
    order: 16,
  },
  {
    name: "Docker",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    proficiency: 4,
    description: "Containerization platform",
    yearsOfExperience: 3,
    isVisible: true,
    order: 17,
  },
  {
    name: "Postman",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    proficiency: 5,
    description: "API development and testing tool",
    yearsOfExperience: 4,
    isVisible: true,
    order: 18,
  },
  {
    name: "Firebase",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    proficiency: 4,
    description: "Backend-as-a-Service platform",
    yearsOfExperience: 3,
    isVisible: true,
    order: 19,
  },
]

const seedSkills = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    // Clear existing skills
    await Skill.deleteMany({})
    console.log("Cleared existing skills")

    // Insert new skills
    await Skill.insertMany(skills)
    console.log(`Successfully seeded ${skills.length} skills`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding skills:", error)
    process.exit(1)
  }
}

seedSkills()
