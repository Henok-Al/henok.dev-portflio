import React, { createContext, useContext, useState, useEffect } from "react"
import { aboutAPI } from "../services/api"

const AboutContext = createContext()

export const useAbout = () => {
  const context = useContext(AboutContext)
  if (!context) {
    throw new Error("useAbout must be used within an AboutProvider")
  }
  return context
}

export const AboutProvider = ({ children }) => {
  const [aboutInfo, setAboutInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAboutInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await aboutAPI.getAbout()
      setAboutInfo(response.data.about)
    } catch (error) {
      console.error("Error fetching about info:", error)
      setError(
        `Failed to fetch about info: ${error.response?.data?.message || error.message}`,
      )
      setAboutInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAboutInfo()
  }, [])

  const value = {
    aboutInfo,
    loading,
    error,
    refetch: fetchAboutInfo,
  }

  return <AboutContext.Provider value={value}>{children}</AboutContext.Provider>
}
