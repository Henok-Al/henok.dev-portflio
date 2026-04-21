import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Card from "./Card"
import { projectsAPI } from "../services/api"

const Projects = ({ loadingHook }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await projectsAPI.getFeaturedProjects()
      setProjects(response.data.projects || [])
    } catch (error) {
      console.error("Error fetching featured projects:", error)
      setError(
        `Failed to fetch featured projects: ${error.response?.data?.message || error.message}`,
      )
      setProjects([])
    } finally {
      setLoading(false)
      if (loadingHook) {
        loadingHook.setComponentLoading("projects", false)
      }
    }
  }

  if (loading) {
    return (
      <section
        className="mt-60 flex w-full flex-col items-center justify-center bg-[#e7e7e7] transition-colors duration-300 lg:-my-6 dark:bg-gray-800"
        id="projects"
      >
        <h1 className="text-center text-[90px] text-[#ff4500] dark:text-[#ff6b35]">
          Projects
        </h1>
        <div className="mt-8 text-center text-2xl text-gray-600 dark:text-gray-300">
          Loading projects...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="mt-60 flex w-full flex-col items-center justify-center bg-[#e7e7e7] transition-colors duration-300 lg:-my-6 dark:bg-gray-800"
        id="projects"
      >
        <h1 className="text-center text-[90px] text-[#ff4500] dark:text-[#ff6b35]">
          Projects
        </h1>
        <div className="mt-8 text-center text-2xl text-red-600 dark:text-red-400">
          <p>Error loading projects:</p>
          <p className="mt-2 text-lg">{error}</p>
          <button
            onClick={fetchFeaturedProjects}
            className="mt-4 rounded bg-[#ff4500] px-6 py-2 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      className="mt-60 flex w-full flex-col items-center justify-center bg-[#e7e7e7] transition-colors duration-300 lg:-my-6 dark:bg-gray-800"
      id="projects"
    >
      <h1 className="text-center text-[90px] text-[#ff4500] dark:text-[#ff6b35]">
        Projects
      </h1>

      {projects.length === 0 ? (
        <div className="mt-8 text-center text-2xl text-gray-600 dark:text-gray-300">
          <p>No featured projects available.</p>
          <p className="mt-2 text-lg">
            Please check the admin panel to add and feature projects.
          </p>
        </div>
      ) : (
        <div className="mx-auto flex w-full flex-col gap-10 p-4 md:gap-32 lg:max-w-[1200px] lg:p-12">
          {projects.map((project, index) => (
            <Card
              key={project._id}
              background={project.imageUrl || "/default-project.png"}
              tech={project.technologies.map((tech) => ({
                src: tech.icon,
                alt: tech.name,
              }))}
              title={project.title}
              desc={project.description}
              number={String(index + 1).padStart(2, "0")}
              github={project.githubUrl}
              link={project.liveUrl}
              align={index % 2 === 0 ? "right" : "left"}
              projectId={project._id}
            />
          ))}
        </div>
      )}

      <div className="mt-16">
        <Link
          to="/projects"
          className="rounded-lg bg-[#ff4500] px-8 py-4 text-xl font-semibold text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
        >
          View All Projects
        </Link>
      </div>
    </section>
  )
}

export default Projects
