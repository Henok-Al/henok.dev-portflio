import React, { useState, useEffect } from "react"
import { contactInfoAPI } from "../../services/api"

const ContactInfoForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    availability: "available",
    preferredContactMethod: "email",
    responseTime: "24 hours",
    workingHours: {
      timezone: "UTC",
      start: "09:00",
      end: "17:00",
    },
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      website: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const availabilityOptions = [
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy" },
    { value: "not-available", label: "Not Available" },
  ]

  const contactMethodOptions = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "any", label: "Any" },
  ]

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await contactInfoAPI.getContactInfo()
      if (response.data.contactInfo) {
        setFormData(response.data.contactInfo)
      }
    } catch (error) {
      console.error("Error fetching contact info:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("location.")) {
      const field = name.split(".")[1]
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: value,
        },
      })
    } else if (name.startsWith("workingHours.")) {
      const field = name.split(".")[1]
      setFormData({
        ...formData,
        workingHours: {
          ...formData.workingHours,
          [field]: value,
        },
      })
    } else if (name.startsWith("socialLinks.")) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await contactInfoAPI.updateContactInfo(formData)
      setMessage("Contact information updated successfully!")
    } catch (error) {
      setMessage("Failed to update contact information")
      console.error("Error updating contact info:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
      <h2 className="mb-6 text-2xl font-bold dark:text-white">
        Contact Information
      </h2>

      {message && (
        <div
          className={`mb-4 rounded p-3 ${message.includes("success") ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Contact Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Contact Method
            </label>
            <select
              name="preferredContactMethod"
              value={formData.preferredContactMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              {contactMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Response Time
            </label>
            <input
              type="text"
              name="responseTime"
              value={formData.responseTime}
              onChange={handleChange}
              placeholder="e.g., 24 hours, 2-3 days"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Location</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Working Hours</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <input
                type="text"
                name="workingHours.timezone"
                value={formData.workingHours.timezone}
                onChange={handleChange}
                placeholder="e.g., UTC, EST, PST"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="workingHours.start"
                value={formData.workingHours.start}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="workingHours.end"
                value={formData.workingHours.end}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                Instagram
              </label>
              <input
                type="url"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="socialLinks.website"
                value={formData.socialLinks.website}
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
            {loading ? "Updating..." : "Update Contact Information"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactInfoForm
