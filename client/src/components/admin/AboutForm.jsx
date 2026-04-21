import React, { useState, useEffect, useRef } from "react"
import { aboutAPI, uploadAPI } from "../../services/api"
import { useAbout } from "../../contexts/AboutContext"

const AboutForm = () => {
  const { refetch } = useAbout()
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    bio: "",
    profileImage: "",
    resumeUrl: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      email: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState({ profile: false, resume: false })
  const profileInputRef = useRef(null)
  const resumeInputRef = useRef(null)

  useEffect(() => {
    fetchAboutInfo()
  }, [])

  const fetchAboutInfo = async () => {
    try {
      const response = await aboutAPI.getAbout()
      if (response.data.about) {
        setFormData(response.data.about)
      }
    } catch (error) {
      console.error("Error fetching about info:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("socialLinks.")) {
      const field = name.split(".")[1]
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileUpload = async (file, type) => {
    try {
      setUploading({ ...uploading, [type]: true })

      let response
      if (type === "profile") {
        response = await uploadAPI.uploadProfileImage(file)
      } else if (type === "resume") {
        response = await uploadAPI.uploadResume(file)
      }

      console.log(response.data)

      if (response.data.success) {
        if (type === "profile") {
          setFormData({ ...formData, profileImage: response.data.imageUrl })
        } else if (type === "resume") {
          setFormData({ ...formData, resumeUrl: response.data.resumeUrl })
        }
        setMessage(
          `${type === "profile" ? "Profile image" : "Resume"} uploaded successfully!`,
        )
      }
    } catch (error) {
      setMessage(
        `Failed to upload ${type === "profile" ? "profile image" : "resume"}`,
      )
      console.error(`Error uploading ${type}:`, error)
    } finally {
      setUploading({ ...uploading, [type]: false })
    }
  }

  const handleFileDelete = async (type) => {
    try {
      const filePath =
        type === "profile" ? formData.profileImage : formData.resumeUrl

      if (filePath && filePath.includes("cloudinary.com")) {
        await uploadAPI.deleteFile(filePath, type)

        if (type === "profile") {
          setFormData({
            ...formData,
            profileImage: "",
          })
        } else if (type === "resume") {
          setFormData({ ...formData, resumeUrl: "/api/download" })
        }

        setMessage(
          `${type === "profile" ? "Profile image" : "Resume"} deleted successfully!`,
        )
      }
    } catch (error) {
      setMessage(
        `Failed to delete ${type === "profile" ? "profile image" : "resume"}`,
      )
      console.error(`Error deleting ${type}:`, error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await aboutAPI.updateAbout(formData)
      setMessage("About information updated successfully!")
      // Refresh the about context to update all components
      await refetch()
    } catch (error) {
      setMessage("Failed to update about information")
      console.error("Error updating about info:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        About Information
      </h2>

      {message && (
        <div
          className={`mb-4 rounded p-3 ${message.includes("success") ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2">
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={5}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="space-y-3">
              {formData.profileImage && (
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full border object-cover"
                    onError={(e) => {
                      console.log(e)
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Current: {formData.profileImage}
                    </p>
                    {formData.profileImage.includes("cloudinary.com") && (
                      <button
                        type="button"
                        onClick={() => handleFileDelete("profile")}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete uploaded image
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) handleFileUpload(file, "profile")
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={uploading.profile}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading.profile ? "Uploading..." : "Upload New Image"}
                </button>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="Or enter image URL"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resume
            </label>
            <div className="space-y-3">
              {formData.resumeUrl && (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Current: {formData.resumeUrl}
                    </p>
                    <div className="mt-1 flex space-x-2">
                      <a
                        href={formData.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Resume
                      </a>
                      {formData.resumeUrl.includes("cloudinary.com") && (
                        <button
                          type="button"
                          onClick={() => handleFileDelete("resume")}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete uploaded resume
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) handleFileUpload(file, "resume")
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploading.resume}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading.resume ? "Uploading..." : "Upload New Resume"}
                </button>
                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="Or enter resume URL"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub
              </label>
              <input
                type="url"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Twitter
              </label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="socialLinks.email"
                value={formData.socialLinks.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-orange-600 px-6 py-2 text-white transition-colors duration-300 hover:bg-orange-700 disabled:opacity-50 dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
          >
            {loading ? "Updating..." : "Update About Information"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AboutForm
