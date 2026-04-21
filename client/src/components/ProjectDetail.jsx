import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  FaGithub,
  FaExternalLinkAlt,
  FaYoutube,
  FaCalendarAlt,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa"
import { BiCode } from "react-icons/bi"
import api from "../services/api"
import PageHelmet from "./PageHelmet"

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [mediaType, setMediaType] = useState("image") // "image" or "video"

  useEffect(() => {
    fetchProject()
  }, [id])

  useEffect(() => {
    if (project) {
      // Set initial media type based on what's available
      if (project.images && project.images.length > 0) {
        setMediaType("image")
        setSelectedMedia(0)
      } else if (project.videos && project.videos.length > 0) {
        setMediaType("video")
        setSelectedMedia(0)
      } else if (project.imageUrl) {
        setMediaType("image")
        setSelectedMedia(0)
      }
    }
  }, [project])

  // Helper function to get all media items
  const getAllMedia = () => {
    const media = []

    // Add main image if exists
    if (project?.imageUrl) {
      media.push({ type: "image", url: project.imageUrl, isMain: true })
    }

    // Add additional images
    if (project?.images && project.images.length > 0) {
      project.images.forEach((image) => {
        media.push({ type: "image", url: image, isMain: false })
      })
    }

    // Add videos
    if (project?.videos && project.videos.length > 0) {
      project.videos.forEach((video) => {
        media.push({ type: "video", url: video, isMain: false })
      })
    }

    return media
  }

  const allMedia = getAllMedia()
  const currentMedia = allMedia[selectedMedia]

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await api.get(`/projects/${id}`)
      setProject(response.data)
    } catch (error) {
      console.error("Error fetching project:", error)
      if (error.response?.status === 404) {
        setError("Project not found")
      } else {
        setError(
          error.response?.data?.message || "Failed to fetch project details",
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#ff4500] border-t-transparent"></div>
            <div className="text-2xl text-gray-600 dark:text-gray-300">
              Loading project details...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl text-red-500">⚠️</div>
            <div className="mb-4 text-2xl text-red-600 dark:text-red-400">
              Error loading project
            </div>
            <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {error}
            </div>
            <div className="space-x-4">
              <button
                onClick={fetchProject}
                className="rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
              >
                Retry
              </button>
              <Link
                to="/"
                className="inline-block rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors duration-300 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <div className="mb-4 text-2xl text-gray-600 dark:text-gray-300">
              Project not found
            </div>
            <Link
              to="/"
              className="inline-block rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHelmet
        title={`${project.title} - Project Details`}
        description={
          project.shortDescription ||
          project.description ||
          `Explore ${project.title}, a project showcasing modern web development skills.`
        }
        ogTitle={`${project.title} - Krishna Jain Portfolio`}
        ogDescription={
          project.description ||
          project.shortDescription ||
          `Detailed view of ${project.title} project with features, tech stack, and implementation details.`
        }
        ogImage={project.imageUrl}
        keywords={[
          "project",
          project.title.toLowerCase(),
          ...(project.technologies || [])
            .map((tech) =>
              typeof tech === "string"
                ? tech.toLowerCase()
                : tech.name?.toLowerCase(),
            )
            .filter(Boolean),
          "web development",
          "portfolio",
        ]}
      />
      <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gray-50 transition-colors duration-300 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#ff4500] transition-colors duration-300 hover:text-[#e03d00] dark:text-[#ff6b35] dark:hover:text-[#ff4500]"
              >
                <FaArrowLeft />
                Back to Portfolio
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                  {project.title}
                </h1>
                <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
                  {project.shortDescription || project.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors duration-300 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <FaGithub />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
                  >
                    <FaExternalLinkAlt />
                    Live Demo
                  </a>
                )}
                {project.youtubeUrl && (
                  <a
                    href={project.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white transition-colors duration-300 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    <FaYoutube />
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Project Images/Videos */}
              {allMedia.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Media Gallery
                  </h2>

                  {/* Main Display */}
                  <div className="mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {currentMedia ? (
                      currentMedia.type === "image" ? (
                        <img
                          src={currentMedia.url}
                          alt={`${project.title} ${currentMedia.isMain ? "main image" : "screenshot"}`}
                          className="h-96 w-full object-cover"
                        />
                      ) : (
                        <video
                          src={currentMedia.url}
                          controls
                          className="h-96 w-full object-cover"
                          key={currentMedia.url} // Force re-render when video changes
                        >
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-400">
                        No media available
                      </div>
                    )}
                  </div>

                  {/* Media Type Tabs */}
                  {((project.images && project.images.length > 0) ||
                    project.imageUrl) &&
                    project.videos &&
                    project.videos.length > 0 && (
                      <div className="mb-4 flex gap-2">
                        <button
                          onClick={() => {
                            setMediaType("image")
                            // Find first image index
                            const firstImageIndex = allMedia.findIndex(
                              (media) => media.type === "image",
                            )
                            if (firstImageIndex !== -1)
                              setSelectedMedia(firstImageIndex)
                          }}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                            mediaType === "image"
                              ? "bg-[#ff4500] text-white dark:bg-[#ff6b35]"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          Images (
                          {(project.images?.length || 0) +
                            (project.imageUrl ? 1 : 0)}
                          )
                        </button>
                        <button
                          onClick={() => {
                            setMediaType("video")
                            // Find first video index
                            const firstVideoIndex = allMedia.findIndex(
                              (media) => media.type === "video",
                            )
                            if (firstVideoIndex !== -1)
                              setSelectedMedia(firstVideoIndex)
                          }}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                            mediaType === "video"
                              ? "bg-[#ff4500] text-white dark:bg-[#ff6b35]"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          Videos ({project.videos?.length || 0})
                        </button>
                      </div>
                    )}

                  {/* Thumbnails */}
                  {allMedia.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allMedia.map((media, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedMedia(index)}
                          className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
                            selectedMedia === index
                              ? "border-[#ff4500] dark:border-[#ff6b35]"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="relative h-full w-full bg-gray-800">
                              <video
                                src={media.url}
                                className="h-full w-full object-cover"
                                muted
                              />
                              {/* Video play icon overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="rounded-full bg-white bg-opacity-80 p-1">
                                  <svg
                                    className="h-4 w-4 text-gray-800"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Media type indicator */}
                          <div className="absolute right-1 top-1">
                            <span
                              className={`inline-block rounded px-1 py-0.5 text-xs font-medium text-white ${
                                media.type === "image"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {media.type === "image" ? "IMG" : "VID"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  About This Project
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {project.description || project.shortDescription}
                  </p>
                </div>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Key Features
                  </h2>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#ff4500] dark:bg-[#ff6b35]"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Info */}
              <div className="rounded-lg bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Project Information
                </h3>

                {/* Timeline */}
                {(project.startDate || project.endDate) && (
                  <div className="mb-4 flex items-center gap-3">
                    <FaCalendarAlt className="text-[#ff4500] dark:text-[#ff6b35]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Timeline
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(project.startDate)} -{" "}
                        {formatDate(project.endDate)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Collaborators */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="mb-4 flex items-start gap-3">
                    <FaUsers className="mt-1 text-[#ff4500] dark:text-[#ff6b35]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Collaborators
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {project.collaborators.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status */}
                {project.status && (
                  <div className="mb-4">
                    <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                      Status
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : project.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {project.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-800">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <BiCode className="text-[#ff4500] dark:text-[#ff6b35]" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#ff4500] px-3 py-1 text-sm font-medium text-white dark:bg-[#ff6b35]"
                      >
                        {typeof tech === "string" ? tech : tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub Stats */}
              {(project.githubStats || project.githubData) && (
                <div className="rounded-lg bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    GitHub Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Stars
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.githubStats?.stars ||
                          project.githubData?.stars ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Forks
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.githubStats?.forks ||
                          project.githubData?.forks ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Language
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.githubStats?.language ||
                          project.githubData?.language ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetail
