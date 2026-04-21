import React, { useState, useEffect, useRef } from "react"
import { workExperienceAPI, uploadAPI } from "../../services/api"

const WorkExperienceManager = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const logoInputRef = useRef(null)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    responsibilities: [""],
    technologies: [""],
    achievements: [""],
    companyLogo: "",
    companyWebsite: "",
    employmentType: "full-time",
    isVisible: true,
    order: 0,
  })

  const employmentTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ]

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await workExperienceAPI.getAllExperiencesAdmin()
      setExperiences(response.data.experiences)
    } catch (error) {
      console.error("Error fetching experiences:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  // Logo upload handler
  const handleLogoUpload = async (file) => {
    try {
      setUploading(true)
      setUploadMessage("")

      const response = await uploadAPI.uploadProjectAsset(file)

      if (response.data.success) {
        setFormData({ ...formData, companyLogo: response.data.assetUrl })
        setUploadMessage("Company logo uploaded successfully!")
        setTimeout(() => setUploadMessage(""), 3000)
      }
    } catch (error) {
      setUploadMessage("Failed to upload company logo")
      console.error("Error uploading logo:", error)
      setTimeout(() => setUploadMessage(""), 3000)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter(
          (item) => item.trim() !== "",
        ),
        technologies: formData.technologies.filter(
          (item) => item.trim() !== "",
        ),
        achievements: formData.achievements.filter(
          (item) => item.trim() !== "",
        ),
      }

      if (editingExperience) {
        await workExperienceAPI.updateExperience(
          editingExperience._id,
          cleanedData,
        )
      } else {
        await workExperienceAPI.createExperience(cleanedData)
      }

      fetchExperiences()
      resetForm()
    } catch (error) {
      console.error("Error saving experience:", error)
    }
  }

  const handleEdit = (experience) => {
    setEditingExperience(experience)
    setFormData({
      ...experience,
      startDate: experience.startDate ? experience.startDate.split("T")[0] : "",
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      responsibilities:
        experience.responsibilities.length > 0
          ? experience.responsibilities
          : [""],
      technologies:
        experience.technologies.length > 0 ? experience.technologies : [""],
      achievements:
        experience.achievements.length > 0 ? experience.achievements : [""],
    })
  }

  const handleDelete = async (experienceId) => {
    if (
      window.confirm("Are you sure you want to delete this work experience?")
    ) {
      try {
        await workExperienceAPI.deleteExperience(experienceId)
        fetchExperiences()
      } catch (error) {
        console.error("Error deleting experience:", error)
      }
    }
  }

  const resetForm = () => {
    setEditingExperience(null)
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      responsibilities: [""],
      technologies: [""],
      achievements: [""],
      companyLogo: "",
      companyWebsite: "",
      employmentType: "full-time",
      isVisible: true,
      order: 0,
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <div className="text-center">Loading work experiences...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          {editingExperience
            ? "Edit Work Experience"
            : "Add New Work Experience"}
        </h2>

        {uploadMessage && (
          <div
            className={`mb-4 rounded border px-4 py-3 ${
              uploadMessage.includes("success")
                ? "border-green-400 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900 dark:text-green-200"
                : "border-red-400 bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {uploadMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              >
                {employmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date (leave empty for current)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <div className="space-y-3">
                {formData.companyLogo && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.companyLogo}
                      alt="Company logo preview"
                      className="h-16 w-16 rounded border bg-white object-contain p-2"
                      onError={(e) => {
                        console.log("Logo load error:", e)
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Current:{" "}
                        {formData.companyLogo.length > 50
                          ? `${formData.companyLogo.substring(0, 50)}...`
                          : formData.companyLogo}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) handleLogoUpload(file)
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Logo"}
                  </button>
                  <input
                    type="url"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                    placeholder="Or enter logo URL"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) =>
                    handleArrayChange("responsibilities", index, e.target.value)
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  placeholder="Enter responsibility"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("responsibilities", index)}
                  className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("responsibilities")}
              className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
            >
              Add Responsibility
            </button>
          </div>

          {/* Technologies */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Technologies
            </label>
            {formData.technologies.map((technology, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={technology}
                  onChange={(e) =>
                    handleArrayChange("technologies", index, e.target.value)
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  placeholder="Enter technology"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("technologies", index)}
                  className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("technologies")}
              className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
            >
              Add Technology
            </button>
          </div>

          {/* Achievements */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Achievements
            </label>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) =>
                    handleArrayChange("achievements", index, e.target.value)
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  placeholder="Enter achievement"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("achievements", index)}
                  className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("achievements")}
              className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
            >
              Add Achievement
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="mr-2"
              />
              Visible
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="mt-1 block w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded bg-orange-600 px-6 py-2 text-white transition-colors duration-300 hover:bg-orange-700 dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
            >
              {editingExperience ? "Update Experience" : "Add Experience"}
            </button>
            {editingExperience && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded bg-gray-600 px-6 py-2 text-white transition-colors duration-300 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Experiences List */}
      <div className="rounded-lg bg-white shadow transition-colors duration-300 dark:bg-gray-700">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold">Work Experiences</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {experiences.map((experience) => (
            <div key={experience._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {experience.companyLogo && (
                    <img
                      src={experience.companyLogo}
                      alt={`${experience.company} logo`}
                      className="h-12 w-12 flex-shrink-0 rounded border bg-white object-contain p-1"
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {experience.position}
                    </h3>
                    <p className="text-md font-medium text-orange-600">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {experience.location} � {formatDate(experience.startDate)}{" "}
                      - {formatDate(experience.endDate)}
                    </p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {experience.description}
                    </p>

                    {experience.technologies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Technologies:{" "}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {experience.technologies.join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                          experience.isVisible
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {experience.isVisible ? "Visible" : "Hidden"}
                      </span>
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold capitalize text-blue-800">
                        {experience.employmentType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No work experiences found. Add your first experience!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkExperienceManager
