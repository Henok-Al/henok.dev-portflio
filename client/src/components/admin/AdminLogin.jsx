import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../../services/api"
import PageHelmet from "../PageHelmet"

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authAPI.login(formData)
      localStorage.setItem("adminToken", response.data.token)
      localStorage.setItem("adminData", JSON.stringify(response.data.admin))
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHelmet
        title="Admin Login - Portfolio Admin Panel"
        description="Admin login page for portfolio management system."
        keywords={["admin", "login", "portfolio", "management"]}
      />
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50 px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg transition-colors duration-300 dark:bg-gray-700">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdminLogin
