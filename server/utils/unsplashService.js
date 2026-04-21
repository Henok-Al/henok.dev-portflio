import axios from "axios"

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "demo" // You'll need to get this from Unsplash
const UNSPLASH_API_URL = "https://api.unsplash.com"

// Fallback images for different project types
const fallbackImages = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop", // Code on screen
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop", // Laptop coding
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop", // Code editor
  "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=600&fit=crop", // Workspace
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop", // Computer setup
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop", // Code on multiple screens
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop", // Developer workspace
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", // Data visualization
]

// Keywords mapping for different project types
const projectKeywords = {
  web: ["web development", "website", "frontend", "backend", "coding"],
  mobile: ["mobile app", "smartphone", "app development", "mobile ui"],
  ai: [
    "artificial intelligence",
    "machine learning",
    "data science",
    "neural network",
  ],
  ml: ["machine learning", "data analysis", "algorithms", "statistics"],
  data: ["data visualization", "analytics", "dashboard", "charts"],
  ecommerce: ["online shopping", "ecommerce", "shopping cart", "retail"],
  social: ["social media", "communication", "networking", "chat"],
  game: ["gaming", "game development", "entertainment", "interactive"],
  finance: ["fintech", "banking", "finance", "money management"],
  education: ["education", "learning", "online course", "teaching"],
  health: ["healthcare", "medical", "health app", "wellness"],
  productivity: ["productivity", "task management", "organization", "workflow"],
  default: ["software development", "programming", "technology", "computer"],
}

// Detect project type from title and description
const detectProjectType = (title, description) => {
  const text = `${title} ${description}`.toLowerCase()

  const typeScores = {}

  Object.keys(projectKeywords).forEach((type) => {
    typeScores[type] = 0
    projectKeywords[type].forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        typeScores[type] += 1
      }
    })
  })

  // Find the type with highest score
  const bestType = Object.keys(typeScores).reduce((a, b) =>
    typeScores[a] > typeScores[b] ? a : b,
  )

  return typeScores[bestType] > 0 ? bestType : "default"
}

// Get project image from Unsplash
export const getProjectImage = async (title, description = "") => {
  try {
    // Detect project type
    const projectType = detectProjectType(title, description)
    const keywords = projectKeywords[projectType] || projectKeywords.default

    // Try to get image from Unsplash
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== "demo") {
      try {
        const searchQuery = keywords[0] // Use the first keyword
        const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
          params: {
            query: searchQuery,
            per_page: 10,
            orientation: "landscape",
            content_filter: "high",
          },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
          timeout: 5000,
        })

        if (response.data.results && response.data.results.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * response.data.results.length,
          )
          const photo = response.data.results[randomIndex]
          return {
            url: photo.urls.regular,
            alt: photo.alt_description || title,
            credit: {
              photographer: photo.user.name,
              photographerUrl: photo.user.links.html,
              unsplashUrl: photo.links.html,
            },
          }
        }
      } catch (apiError) {
        console.warn("Unsplash API error:", apiError.message)
      }
    }

    // Fallback to curated images
    const randomIndex = Math.floor(Math.random() * fallbackImages.length)
    return {
      url: fallbackImages[randomIndex],
      alt: `${title} project image`,
      credit: {
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    }
  } catch (error) {
    console.error("Error getting project image:", error)

    // Ultimate fallback
    return {
      url: fallbackImages[0],
      alt: `${title} project image`,
      credit: {
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    }
  }
}

// Get multiple project images
export const getProjectImages = async (projects) => {
  try {
    const imagePromises = projects.map(async (project) => {
      const imageData = await getProjectImage(
        project.title,
        project.description,
      )
      return {
        ...project,
        autoImage: imageData,
      }
    })

    return await Promise.all(imagePromises)
  } catch (error) {
    console.error("Error getting project images:", error)
    return projects.map((project) => ({
      ...project,
      autoImage: {
        url: fallbackImages[0],
        alt: `${project.title} project image`,
        credit: {
          photographer: "Unsplash",
          photographerUrl: "https://unsplash.com",
          unsplashUrl: "https://unsplash.com",
        },
      },
    }))
  }
}

// Get background images for different themes
export const getBackgroundImage = async (theme = "tech") => {
  try {
    const themeKeywords = {
      tech: ["technology", "abstract tech", "digital", "futuristic"],
      minimal: ["minimal", "clean", "simple", "geometric"],
      nature: ["nature", "landscape", "mountains", "forest"],
      urban: ["city", "urban", "architecture", "modern"],
      gradient: ["gradient", "abstract", "colorful", "design"],
    }

    const keywords = themeKeywords[theme] || themeKeywords.tech

    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== "demo") {
      try {
        const searchQuery = keywords[0]
        const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
          params: {
            query: searchQuery,
            per_page: 10,
            orientation: "landscape",
            content_filter: "high",
          },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
          timeout: 5000,
        })

        if (response.data.results && response.data.results.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * response.data.results.length,
          )
          const photo = response.data.results[randomIndex]
          return {
            url: photo.urls.regular,
            alt: photo.alt_description || `${theme} background`,
            credit: {
              photographer: photo.user.name,
              photographerUrl: photo.user.links.html,
              unsplashUrl: photo.links.html,
            },
          }
        }
      } catch (apiError) {
        console.warn("Unsplash API error:", apiError.message)
      }
    }

    // Fallback backgrounds
    const fallbackBackgrounds = {
      tech: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      minimal:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop",
      nature:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
      urban:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
      gradient:
        "https://images.unsplash.com/photo-1557683304-673a23048d34?w=1200&h=800&fit=crop",
    }

    return {
      url: fallbackBackgrounds[theme] || fallbackBackgrounds.tech,
      alt: `${theme} background`,
      credit: {
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    }
  } catch (error) {
    console.error("Error getting background image:", error)
    return {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      alt: "Tech background",
      credit: {
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    }
  }
}
