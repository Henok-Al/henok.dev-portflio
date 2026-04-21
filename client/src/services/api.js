import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
}

// Projects API
export const projectsAPI = {
  // Public endpoints
  getAllProjects: () => api.get("/projects"),
  getFeaturedProjects: () => api.get("/projects/featured"),
  getProject: (id) => api.get(`/projects/${id}`),

  // Admin endpoints
  getAllProjectsAdmin: () => api.get("/projects/admin/all"),
  createProject: (projectData) => api.post("/projects", projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getGithubRepos: () => api.get("/projects/github/repos"),
  updateFeaturedProjects: (projectIds) =>
    api.post("/projects/featured/update", { projectIds }),
}

// About API
export const aboutAPI = {
  getAbout: () => api.get("/about"),
  updateAbout: (aboutData) => api.put("/about", aboutData),
}

// Skills API
export const skillsAPI = {
  getAllSkills: () => api.get("/skills"),
  getSkillsGrouped: () => api.get("/skills/grouped"),
  getSkillsByCategory: (category) => api.get(`/skills?category=${category}`),

  // Admin endpoints
  getAllSkillsAdmin: () => api.get("/skills/admin/all"),
  createSkill: (skillData) => api.post("/skills", skillData),
  updateSkill: (id, skillData) => api.put(`/skills/${id}`, skillData),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
}

// Work Experience API
export const workExperienceAPI = {
  getAllExperiences: () => api.get("/work-experience"),
  getExperience: (id) => api.get(`/work-experience/${id}`),

  // Admin endpoints
  getAllExperiencesAdmin: () => api.get("/work-experience/admin/all"),
  createExperience: (experienceData) =>
    api.post("/work-experience", experienceData),
  updateExperience: (id, experienceData) =>
    api.put(`/work-experience/${id}`, experienceData),
  deleteExperience: (id) => api.delete(`/work-experience/${id}`),
}

// Contact Info API
export const contactInfoAPI = {
  getContactInfo: () => api.get("/contact-info"),
  updateContactInfo: (contactData) => api.put("/contact-info", contactData),
}

// Messages API
export const messagesAPI = {
  // Public endpoint
  sendMessage: (messageData) => api.post("/messages", messageData),

  // Admin endpoints
  getAllMessages: (page = 1, limit = 10) =>
    api.get(`/messages?page=${page}&limit=${limit}`),
  getMessage: (id) => api.get(`/messages/${id}`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
  markAsRead: (id, isRead) => api.patch(`/messages/${id}/read`, { isRead }),
}

// Achievements API
export const achievementsAPI = {
  // Public endpoints
  getAllAchievements: () => api.get("/achievements"),
  getAchievementsByCategory: (category) =>
    api.get(`/achievements/category/${category}`),
  getAchievement: (id) => api.get(`/achievements/${id}`),

  // Admin endpoints
  getAllAchievementsAdmin: () => api.get("/achievements/admin/all"),
  createAchievement: (achievementData) =>
    api.post("/achievements", achievementData),
  updateAchievement: (id, achievementData) =>
    api.put(`/achievements/${id}`, achievementData),
  deleteAchievement: (id) => api.delete(`/achievements/${id}`),
  reorderAchievements: (achievements) =>
    api.patch("/achievements/reorder", { achievements }),
}

// Upload API
export const uploadAPI = {
  uploadProfileImage: (file) => {
    const formData = new FormData()
    formData.append("profileImage", file)
    return api.post("/upload/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append("resume", file)
    return api.post("/upload/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  uploadProjectAsset: (file) => {
    const formData = new FormData()
    formData.append("projectAsset", file)
    return api.post("/upload/project-assets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  uploadAchievementImage: (file) => {
    const formData = new FormData()
    formData.append("achievementImage", file)
    return api.post("/upload/achievement-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  deleteFile: (filePath, type) =>
    api.delete("/upload/file", { data: { filePath, type } }),
  getFileInfo: (filePath) =>
    api.get(`/upload/file-info?filePath=${encodeURIComponent(filePath)}`),
  getFiles: () => api.get("/upload/files"),
}

export default api
