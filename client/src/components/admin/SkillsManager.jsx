import React, { useState, useEffect } from "react"
import { skillsAPI } from "../../services/api"

const SkillsManager = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend",
    icon: "",
    proficiency: 3,
    description: "",
    yearsOfExperience: 0,
    isVisible: true,
    order: 0,
  })

  const categories = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "database", label: "Database" },
    { value: "tools", label: "Tools" },
    { value: "cloud", label: "Cloud" },
    { value: "mobile", label: "Mobile" },
    { value: "other", label: "Other" },
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await skillsAPI.getAllSkillsAdmin()
      setSkills(response.data.skills)
    } catch (error) {
      console.error("Error fetching skills:", error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSkill) {
        await skillsAPI.updateSkill(editingSkill._id, formData)
      } else {
        await skillsAPI.createSkill(formData)
      }

      fetchSkills()
      resetForm()
    } catch (error) {
      console.error("Error saving skill:", error)
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData(skill)
  }

  const handleDelete = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await skillsAPI.deleteSkill(skillId)
        fetchSkills()
      } catch (error) {
        console.error("Error deleting skill:", error)
      }
    }
  }

  const resetForm = () => {
    setEditingSkill(null)
    setFormData({
      name: "",
      category: "frontend",
      icon: "",
      proficiency: 3,
      description: "",
      yearsOfExperience: 0,
      isVisible: true,
      order: 0,
    })
  }

  if (loading) {
    return <div className="text-center">Loading skills...</div>
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          {editingSkill ? "Edit Skill" : "Add New Skill"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Icon Key{" "}
                <a href="https://devicon.dev/" target="_blank" rel="noreferrer">
                  (Devicons)
                </a>
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proficiency (1-5)
              </label>
              <input
                type="number"
                name="proficiency"
                value={formData.proficiency}
                onChange={handleChange}
                min="1"
                max="5"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
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
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Visible</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded bg-orange-600 px-6 py-2 text-white transition-colors duration-300 hover:bg-orange-700 dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
            >
              {editingSkill ? "Update Skill" : "Add Skill"}
            </button>
            {editingSkill && (
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

      {/* Skills List */}
      <div className="rounded-lg bg-white shadow transition-colors duration-300 dark:bg-gray-700">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">Skills List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Proficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {skills.map((skill) => (
                <tr key={skill._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="mr-3 h-8 w-8 object-contain"
                        src={skill.icon}
                        alt={skill.name}
                        onError={(e) => {
                          e.target.src = "/default-icon.png"
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {skill.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {skill.yearsOfExperience} years
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold capitalize text-blue-800">
                      {skill.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`text-sm ${index < skill.proficiency ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        skill.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {skill.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SkillsManager
