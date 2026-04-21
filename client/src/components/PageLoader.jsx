import React from "react"

const PageLoader = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  const containerClasses = {
    small: "p-4",
    medium: "p-8",
    large: "p-12",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses[size]}`}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-[#ff4500] dark:border-gray-700 dark:border-t-[#ff6b35]`}
      ></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  )
}

export default PageLoader
