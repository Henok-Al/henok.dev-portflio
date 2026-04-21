import React, { useState } from "react"
import { FaDownload, FaEye, FaExclamationTriangle } from "react-icons/fa"
import { downloadResume, viewResume } from "../utils/downloadUtils"

const ResumeButton = ({
  resumeUrl,
  name,
  variant = "download",
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleDownload = async () => {
    if (!resumeUrl) {
      setMessage("Resume not available")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const result = await downloadResume(resumeUrl, name)
      setMessage(result.message)

      if (!result.success) {
        setTimeout(() => setMessage(""), 5000)
      } else {
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Failed to download resume")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = () => {
    if (!resumeUrl) {
      setMessage("Resume not available")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const result = viewResume(resumeUrl)
    if (!result.success) {
      setMessage(result.message)
      setTimeout(() => setMessage(""), 5000)
    }
  }

  const isDownloadVariant = variant === "download"
  const buttonText = isDownloadVariant ? "Download Resume" : "View Resume"
  const icon = isDownloadVariant ? <FaDownload /> : <FaEye />

  return (
    <div className="relative">
      <button
        onClick={isDownloadVariant ? handleDownload : handleView}
        disabled={isLoading || !resumeUrl}
        className={`relative z-10 flex w-fit items-center justify-center gap-3 px-6 py-3 text-lg font-medium shadow-lg transition-all duration-700 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-[-1] before:origin-left before:scale-x-0 before:transition-all before:duration-700 before:content-[""] ${
          !resumeUrl
            ? "cursor-not-allowed bg-gray-400 text-gray-200 dark:bg-gray-600"
            : isLoading
              ? "cursor-not-allowed bg-gray-400 text-white dark:bg-gray-600"
              : "border-2 border-[#ff4500] bg-transparent text-[#ff4500] before:bg-[#ff4500] hover:text-white before:hover:scale-x-100 dark:border-[#ff6b35] dark:text-[#ff6b35] dark:before:bg-[#ff6b35] dark:hover:text-white"
        } ${className}`}
      >
        <span>{isLoading ? "Loading..." : buttonText}</span>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        ) : (
          icon
        )}
      </button>

      {/* Message display */}
      {message && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 rounded-md p-2 text-sm ${
            message.includes("Failed") || message.includes("not available")
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {(message.includes("Failed") ||
              message.includes("not available")) && (
              <FaExclamationTriangle className="text-xs" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeButton
