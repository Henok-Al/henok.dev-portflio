import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { projectsAPI, authAPI } from "../../services/api"
import ProjectForm from "./ProjectForm"
import ProjectList from "./ProjectList"
import GithubRepos from "./GithubRepos"
import AboutForm from "./AboutForm"
import SkillsManager from "./SkillsManager"
import WorkExperienceManager from "./WorkExperienceManager"
import AchievementsManager from "./AchievementsManager"
import ContactInfoForm from "./ContactInfoForm"
import MessagesManager from "./MessagesManager"
import PageHelmet from "../PageHelmet"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
    fetchProjects()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      navigate("/admin")
      return
    }

    try {
      const response = await authAPI.getProfile()
      setAdmin(response.data.admin)
    } catch (error) {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminData")
      navigate("/admin")
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getAllProjectsAdmin()
      setProjects(response.data.projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    navigate("/admin")
  }

  const handleProjectCreated = () => {
    fetchProjects()
    setActiveTab("projects")
  }

  const handleProjectUpdated = () => {
    fetchProjects()
  }

  const handleProjectDeleted = () => {
    fetchProjects()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
        <div className="text-2xl dark:text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <PageHelmet
        title="Admin Dashboard - Portfolio Management"
        description="Admin dashboard for managing portfolio content, projects, skills, and experience."
        keywords={[
          "admin",
          "dashboard",
          "portfolio",
          "management",
          "projects",
          "skills",
        ]}
      />
      <div className="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white shadow transition-colors duration-300 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {admin?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="border-b bg-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("projects")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "projects"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("add-project")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "add-project"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Add Project
              </button>
              <button
                onClick={() => setActiveTab("github")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "github"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                GitHub Repos
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "about"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "skills"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "experience"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "contact"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Contact Info
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "achievements"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-300 ${
                  activeTab === "messages"
                    ? "border-orange-500 text-orange-600 dark:text-[#ff6b35]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Messages
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeTab === "projects" && (
              <ProjectList
                projects={projects}
                onProjectUpdated={handleProjectUpdated}
                onProjectDeleted={handleProjectDeleted}
              />
            )}
            {activeTab === "add-project" && (
              <ProjectForm onProjectCreated={handleProjectCreated} />
            )}
            {activeTab === "github" && (
              <GithubRepos onProjectCreated={handleProjectCreated} />
            )}
            {activeTab === "about" && <AboutForm />}
            {activeTab === "skills" && <SkillsManager />}
            {activeTab === "experience" && <WorkExperienceManager />}
            {activeTab === "contact" && <ContactInfoForm />}
            {activeTab === "achievements" && <AchievementsManager />}
            {activeTab === "messages" && <MessagesManager />}
          </div>
        </main>
      </div>
    </>
  )
}

export default AdminDashboard
