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

    // For Cloudinary PDFs, use fetch to get the blob
    if (url.includes("cloudinary.com") && url.includes(".pdf")) {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch")

        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = blobUrl
        link.download = filename || "resume.pdf"
        link.click()

        window.URL.revokeObjectURL(blobUrl)
        return { success: true, message: "Download started" }
      } catch (fetchError) {
        // Fallback to direct download
        console.error("Fetch failed, using direct download:", fetchError)
      }
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
  // Use API route as proxy for Cloudinary
  const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`

  // For cloudinary PDFs, try using the proxy route first
  if (resumeUrl?.includes("cloudinary.com") && resumeUrl?.includes(".pdf")) {
    try {
      const response = await fetch("/api/upload/resume/download")
      if (response.ok) {
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(blobUrl)
        return { success: true, message: "Download started" }
      }
    } catch (e) {
      console.error("Proxy failed:", e)
    }
  }

  // Fallback
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
    // For Cloudinary PDF URLs, use a fetch approach to get the blob
    // then open in new tab with the blob URL
    if (resumeUrl.includes("cloudinary.com") && resumeUrl.endsWith(".pdf")) {
      // Create a link that opens directly
      window.open(resumeUrl, "_blank")
      return { success: true, message: "Resume opened in new tab" }
    }

    window.open(resumeUrl, "_blank", "noopener,noreferrer")
    return { success: true, message: "Resume opened in new tab" }
  } catch (error) {
    console.error("Error opening resume:", error)
    return { success: false, message: "Failed to open resume" }
  }
}
