import React, { useState, useEffect } from "react"
import { achievementsAPI, uploadAPI } from "../../services/api"

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "certification",
    date: "",
    organization: "",
    imageUrl: "",
    certificateUrl: "",
    credentialId: "",
    skills: [],
    isVisible: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploading, setUploading] = useState(false)
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await achievementsAPI.getAllAchievementsAdmin()
      setAchievements(response.data.achievements)
    } catch (error) {
      console.error("Error fetching achievements:", error)
      alert("Failed to fetch achievements")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl

    try {
      setUploading(true)
      const response = await uploadAPI.uploadAchievementImage(imageFile)
      return response.data.url
    } catch (error) {
      console.error("Error uploading achievement image:", error)
      alert("Failed to upload achievement image")
      return formData.imageUrl
    } finally {
      setUploading(false)
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.date) {
      alert("Please fill in all required fields")
      return
    }

    // Validate description word count (fixed range for uniform appearance)
    const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length
    const targetWords = 25 // Fixed target word count
    const minWords = targetWords - 2 // 23 words minimum
    const maxWords = targetWords + 2 // 27 words maximum
    
    if (wordCount < minWords || wordCount > maxWords) {
      alert(`Description must be between ${minWords}-${maxWords} words (target: ${targetWords} words) for uniform carousel appearance. Current: ${wordCount} words`)
      return
    }

    // Check if we have an image (either uploaded file or existing URL)
    if (!imageFile && !formData.imageUrl) {
      alert("Please select an image for the achievement")
      return
    }
    
    try {
      setLoading(true)
      
      // Upload image if there's a new one, otherwise use existing URL
      let imageUrl = formData.imageUrl
      if (imageFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          alert("Failed to upload image. Please try again.")
          return
        }
      }
      
      const achievementData = {
        ...formData,
        imageUrl,
        date: new Date(formData.date).toISOString(),
      }

      if (editingAchievement) {
        await achievementsAPI.updateAchievement(editingAchievement._id, achievementData)
        alert("Achievement updated successfully!")
      } else {
        await achievementsAPI.createAchievement(achievementData)
        alert("Achievement created successfully!")
      }

      resetForm()
      fetchAchievements()
    } catch (error) {
      console.error("Error saving achievement:", error)
      alert(`Failed to save achievement: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      date: new Date(achievement.date).toISOString().split('T')[0],
      organization: achievement.organization || "",
      imageUrl: achievement.imageUrl,
      certificateUrl: achievement.certificateUrl || "",
      credentialId: achievement.credentialId || "",
      skills: achievement.skills || [],
      isVisible: achievement.isVisible,
    })
    setImagePreview(achievement.imageUrl)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      try {
        await achievementsAPI.deleteAchievement(id)
        alert("Achievement deleted successfully!")
        fetchAchievements()
      } catch (error) {
        console.error("Error deleting achievement:", error)
        alert("Failed to delete achievement")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "certification",
      date: "",
      organization: "",
      imageUrl: "",
      certificateUrl: "",
      credentialId: "",
      skills: [],
      isVisible: true,
    })
    setEditingAchievement(null)
    setImageFile(null)
    setImagePreview("")
    setShowForm(false)
    setSkillInput("")
  }

  const getCategoryColor = (category) => {
    const colors = {
      certification: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      award: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      recognition: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      event: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      achievement: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  if (loading && achievements.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-700">
        <div className="text-center dark:text-white">Loading achievements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Achievements & Recognition</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Add Achievement
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">
                {editingAchievement ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium dark:text-white">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-white">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="certification">Certification</option>
                    <option value="award">Award</option>
                    <option value="recognition">Recognition</option>
                    <option value="event">Event</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe your achievement in detail (23-27 words required for uniform appearance)..."
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Required: 23-27 words (target: 25) for uniform carousel appearance
                  </span>
                  <span className={`font-medium ${(() => {
                    const currentWords = formData.description.trim() ? formData.description.trim().split(/\s+/).filter(word => word.length > 0).length : 0
                    const targetWords = 25
                    const minWords = targetWords - 2
                    const maxWords = targetWords + 2
                    
                    if (currentWords >= minWords && currentWords <= maxWords) {
                      return "text-green-600 dark:text-green-400"
                    } else if (currentWords === 0) {
                      return "text-gray-500 dark:text-gray-400"
                    } else {
                      return "text-red-600 dark:text-red-400"
                    }
                  })()}`}>
                    {formData.description.trim() ? formData.description.trim().split(/\s+/).filter(word => word.length > 0).length : 0}/25 words
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium dark:text-white">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-white">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Achievement Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingAchievement && !formData.imageUrl}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload an image for this achievement (JPG, PNG, GIF supported)
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 rounded object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Image preview</p>
                  </div>
                )}
                {!imagePreview && !imageFile && (
                  <div className="mt-2 flex h-32 w-32 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No image selected</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium dark:text-white">Certificate URL</label>
                  <input
                    type="url"
                    name="certificateUrl"
                    value={formData.certificateUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-white">Credential ID</label>
                  <input
                    type="text"
                    name="credentialId"
                    value={formData.credentialId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white">Skills</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="flex-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium dark:text-white">Visible on website</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : editingAchievement ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded bg-gray-600 py-2 text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievements List */}
      <div className="rounded-lg bg-white shadow dark:bg-gray-700">
        <div className="p-6">
          {achievements.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No achievements found. Add your first achievement!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className={`rounded px-2 py-1 text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                      {achievement.category.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(achievement._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <img
                    src={achievement.imageUrl}
                    alt={achievement.title}
                    className="mb-3 h-32 w-full rounded object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/300"
                    }}
                  />

                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h3>

                  {achievement.organization && (
                    <p className="mb-2 text-sm text-blue-600 dark:text-blue-400">
                      {achievement.organization}
                    </p>
                  )}

                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description.length > 100
                      ? `${achievement.description.substring(0, 100)}...`
                      : achievement.description}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>

                  {achievement.skills && achievement.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {achievement.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {achievement.skills.length > 3 && (
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                          +{achievement.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs ${achievement.isVisible ? "text-green-600" : "text-red-600"}`}>
                      {achievement.isVisible ? "Visible" : "Hidden"}
                    </span>
                    {achievement.certificateUrl && (
                      <a
                        href={achievement.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementsManager