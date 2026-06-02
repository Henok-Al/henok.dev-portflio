import express from "express"
import mongoose from "mongoose"
import Project from "../models/project.js"
import auth from "../middleware/auth.js"
import { fetchGithubRepos, fetchGithubRepoDetails } from "../utils/github.js"
import { getProjectImage } from "../utils/unsplashService.js"

const router = express.Router()

// Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ isVisible: true }).sort({
      order: 1,
      createdAt: -1,
    })
    res.json({ success: true, projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get featured projects (public)
router.get("/featured", async (req, res) => {
  try {
    const projects = await Project.find({ isFeatured: true, isVisible: true })
      .sort({ order: 1 })
      .limit(4)
    res.json({ success: true, projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Admin routes (protected)

// Get all projects for admin
router.get("/admin/all", auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json({ success: true, projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Fetch GitHub repositories
router.get("/github/repos", auth, async (req, res) => {
  try {
    if (!req.admin.githubUsername) {
      return res
        .status(400)
        .json({ success: false, message: "GitHub username not set" })
    }

    const repos = await fetchGithubRepos(req.admin.githubUsername)

    const existingProjects = await Project.find({}, "githubUrl title")
    const existingGithubUrls = existingProjects.map(
      (project) => project.githubUrl,
    )

    const reposWithImportStatus = repos.map((repo) => ({
      ...repo,
      isImported: existingGithubUrls.includes(repo.html_url),
      existingProject: existingProjects.find(
        (project) => project.githubUrl === repo.html_url,
      ),
    }))

    res.json({ success: true, repos: reposWithImportStatus })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update featured projects
router.post("/featured/update", auth, async (req, res) => {
  try {
    const { projectIds } = req.body

    await Project.updateMany({}, { isFeatured: false })

    if (projectIds && projectIds.length > 0) {
      await Project.updateMany(
        { _id: { $in: projectIds } },
        { isFeatured: true },
      )

      for (let i = 0; i < projectIds.length; i++) {
        await Project.findByIdAndUpdate(projectIds[i], { order: i })
      }
    }

    res.json({
      success: true,
      message: "Featured projects updated successfully",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get single project (public) - MUST be after static routes
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" })
    }
    const project = await Project.findById(req.params.id)
    if (!project || !project.isVisible) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" })
    }
    res.json(project)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create project
router.post("/", auth, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      technologies: (req.body.technologies || []).map(({ name, icon }) => ({
        name,
        icon:
          icon && !icon.startsWith("http")
            ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/" +
              icon
            : icon,
      })),
    }

    if (!projectData.imageUrl && projectData.title) {
      const imageData = await getProjectImage(
        projectData.title,
        projectData.description,
      )
      projectData.imageUrl = imageData.url
    }

    const project = new Project(projectData)

    if (project.githubUrl) {
      const repoName = project.githubUrl.split("/").pop()
      const githubData = await fetchGithubRepoDetails(
        req.admin.githubUsername,
        repoName,
      )
      project.githubData = githubData
    }

    await project.save()
    res.status(201).json({ success: true, project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" })
    }

    const updateData = { ...req.body }

    if (updateData.technologies && Array.isArray(updateData.technologies)) {
      updateData.technologies = updateData.technologies.map(
        ({ name, icon }) => ({
          name,
          icon:
            icon && !icon.startsWith("http")
              ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/" +
                icon
              : icon,
        }),
      )
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" })
    }

    if (project.githubUrl) {
      const repoName = project.githubUrl.split("/").pop()
      const githubData = await fetchGithubRepoDetails(
        req.admin.githubUsername,
        repoName,
      )
      project.githubData = githubData
      await project.save()
    }

    res.json({ success: true, project })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" })
    }
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" })
    }
    res.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
