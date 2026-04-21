/**
 * Download a file from a URL
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The desired filename for the download
 */
export const downloadFile = async (url, filename) => {
  try {
    // Check if the URL is valid
    if (!url) {
      throw new Error("No file URL provided")
    }

    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = url
    link.download = filename || "download"
    link.target = "_blank"
    link.rel = "noopener noreferrer"

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return { success: true, message: "Download started successfully" }
  } catch (error) {
    console.error("Download error:", error)
    return {
      success: false,
      message: error.message || "Failed to download file",
    }
  }
}

/**
 * Download resume with proper filename
 * @param {string} resumeUrl - The URL of the resume
 * @param {string} name - The person's name for filename
 */
export const downloadResume = async (resumeUrl, name = "Resume") => {
  const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`
  return downloadFile(resumeUrl, filename)
}

/**
 * Open resume in new tab
 * @param {string} resumeUrl - The URL of the resume
 */
export const viewResume = (resumeUrl) => {
  if (!resumeUrl) {
    return { success: false, message: "No resume URL provided" }
  }

  try {
    window.open(resumeUrl, "_blank", "noopener,noreferrer")
    return { success: true, message: "Resume opened in new tab" }
  } catch (error) {
    console.error("Error opening resume:", error)
    return { success: false, message: "Failed to open resume" }
  }
}
