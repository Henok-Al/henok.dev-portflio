import React, { useState, useEffect } from "react"
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { workExperienceAPI } from "../services/api"
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa"

const WorkExperience = ({ loadingHook }) => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await workExperienceAPI.getAllExperiences()
      setExperiences(response.data.experiences)
    } catch (err) {
      console.error("Error fetching work experiences:", err)
      setError(
        `Failed to fetch work experiences: ${err.response?.data?.message || err.message}`,
      )
      setExperiences([])
    } finally {
      setLoading(false)
      if (loadingHook) {
        loadingHook.setComponentLoading("workExperience", false)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end - start)
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))

    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`
    } else {
      const years = Math.floor(diffMonths / 12)
      const months = diffMonths % 12
      return `${years} year${years > 1 ? "s" : ""}${months > 0 ? ` ${months} month${months > 1 ? "s" : ""}` : ""}`
    }
  }

  if (loading) {
    return (
      <section
        className="bg-gray-50 py-20 transition-colors duration-300 dark:bg-gray-800"
        id="experience"
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
            Work Experience
          </h2>
          <div className="text-center dark:text-gray-300">Loading...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="bg-gray-50 py-20 transition-colors duration-300 dark:bg-gray-800"
        id="experience"
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
            Work Experience
          </h2>
          <div className="text-center">
            <div className="mb-4 text-2xl text-red-600 dark:text-red-400">
              Error loading work experience:
            </div>
            <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {error}
            </div>
            <button
              onClick={fetchExperiences}
              className="rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (experiences.length === 0) {
    return (
      <section
        className="bg-gray-50 py-20 transition-colors duration-300 dark:bg-gray-800"
        id="experience"
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
            Work Experience
          </h2>
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>No work experience available.</p>
            <p className="mt-2 text-sm">
              Please check the admin panel to add work experience.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="bg-gray-50 py-20 transition-colors duration-300 dark:bg-gray-800"
      id="experience"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
          Work Experience
        </h2>

        <VerticalTimeline>
          {experiences.map((experience) => (
            <VerticalTimelineElement
              key={experience._id}
              className="vertical-timeline-element--work"
              contentStyle={{
                background: "white",
                color: "#333",
                boxShadow: "0 3px 0 #ff4500",
                borderRadius: "8px",
              }}
              contentArrowStyle={{ borderRight: "7px solid white" }}
              date={`${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`}
              iconStyle={{ background: "#ff4500", color: "#fff" }}
              icon={<FaBriefcase />}
            >
              <div className="experience-content">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {experience.position}
                    </h3>
                    <h4 className="mb-2 text-lg font-semibold text-[#ff4500] dark:text-[#ff6b35]">
                      {experience.company}
                    </h4>

                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      {experience.location && (
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          <span>{experience.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>
                          {calculateDuration(
                            experience.startDate,
                            experience.endDate,
                          )}
                        </span>
                      </div>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-600 dark:text-gray-200">
                        {experience.employmentType}
                      </span>
                    </div>
                  </div>

                  {experience.companyLogo && (
                    <img
                      src={experience.companyLogo}
                      alt={`${experience.company} logo`}
                      className="ml-4 h-12 w-12 object-contain"
                    />
                  )}
                </div>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {experience.description}
                </p>

                {experience.responsibilities &&
                  experience.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Key Responsibilities:
                      </h5>
                      <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                        {experience.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index} className="text-sm">
                              {responsibility}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {experience.achievements &&
                  experience.achievements.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Key Achievements:
                      </h5>
                      <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                        {experience.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="text-sm text-green-700 dark:text-green-400"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Technologies Used:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {experience.companyWebsite && (
                  <a
                    href={experience.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#ff4500] hover:text-[#e03d00] dark:text-[#ff6b35] dark:hover:text-[#ff4500]"
                  >
                    <FaExternalLinkAlt />
                    Company Website
                  </a>
                )}
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </section>
  )
}

export default WorkExperience
