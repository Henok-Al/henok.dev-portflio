import React, { useState } from "react"
import { projectsAPI } from "../../services/api"
import ProjectForm from "./ProjectForm"

const ProjectList = ({ projects, onProjectUpdated, onProjectDeleted }) => {
  const [editingProject, setEditingProject] = useState(null)
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsAPI.deleteProject(projectId)
        onProjectDeleted()
      } catch (error) {
        console.error("Error deleting project:", error)
        alert("Failed to delete project")
      }
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
  }

  const handleProjectUpdated = () => {
    setEditingProject(null)
    onProjectUpdated()
  }

  const handleFeaturedChange = (projectId, isFeatured) => {
    if (isFeatured) {
      if (featuredProjects.length < 4) {
        setFeaturedProjects([...featuredProjects, projectId])
      } else {
        alert("You can only have 4 featured projects")
        return
      }
    } else {
      setFeaturedProjects(featuredProjects.filter((id) => id !== projectId))
    }
  }

  const updateFeaturedProjects = async () => {
    try {
      setLoading(true)
      await projectsAPI.updateFeaturedProjects(featuredProjects)
      onProjectUpdated()
      alert("Featured projects updated successfully!")
    } catch (error) {
      console.error("Error updating featured projects:", error)
      alert("Failed to update featured projects")
    } finally {
      setLoading(false)
    }
  }

  if (editingProject) {
    return (
      <ProjectForm
        editProject={editingProject}
        onProjectCreated={handleProjectUpdated}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="rounded-lg bg-white shadow transition-colors duration-300 dark:bg-gray-700">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold dark:text-white">Projects</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Featured: {projects.filter((p) => p.isFeatured).length}/4
          </span>
          <button
            onClick={updateFeaturedProjects}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {loading ? "Updating..." : "Update Featured"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                GitHub Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-700">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={project.imageUrl || "/default-project.png"}
                        alt={project.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.description.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        project.isFeatured
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.isFeatured ? "Featured" : "Regular"}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        project.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {project.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>⭐ {project.githubData?.stars || 0}</span>
                    <span>🍴 {project.githubData?.forks || 0}</span>
                    <span>{project.githubData?.language || "N/A"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      GitHub
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No projects found. Add your first project!
        </div>
      )}
    </div>
  )
}

export default ProjectList
