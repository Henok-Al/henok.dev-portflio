import React from "react"
import { Link } from "react-router-dom"
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa"
import PageHelmet from "./PageHelmet"

const NotFound = () => {
  return (
    <>
      <PageHelmet
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to the homepage to explore the portfolio."
        keywords={["404", "not found", "error", "page not found"]}
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md text-center">
          {/* 404 Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <FaExclamationTriangle className="text-5xl text-red-500 dark:text-red-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <FaSearch className="text-xl text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-white">
              4<span className="text-[#ff4500] dark:text-[#ff6b35]">0</span>4
            </h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#ff4500] px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#e03d00] hover:shadow-xl dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
            >
              <FaHome className="text-xl" />
              Back to Homepage
            </Link>

            <Link
              to="/projects"
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg border-2 border-[#ff4500] bg-transparent px-6 py-3 text-lg font-medium text-[#ff4500] transition-all duration-300 hover:bg-[#ff4500] hover:text-white dark:border-[#ff6b35] dark:text-[#ff6b35] dark:hover:bg-[#ff6b35] dark:hover:text-white"
            >
              View All Projects
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Looking for something specific?
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                •{" "}
                <Link
                  to="/"
                  className="text-[#ff4500] hover:underline dark:text-[#ff6b35]"
                >
                  Homepage
                </Link>{" "}
                - View the complete portfolio
              </p>
              <p>
                •{" "}
                <Link
                  to="/projects"
                  className="text-[#ff4500] hover:underline dark:text-[#ff6b35]"
                >
                  Projects
                </Link>{" "}
                - Browse all projects
              </p>
              <p>
                •{" "}
                <Link
                  to="/admin"
                  className="text-[#ff4500] hover:underline dark:text-[#ff6b35]"
                >
                  Admin
                </Link>{" "}
                - Admin panel access
              </p>
            </div>
          </div>

          {/* Fun Animation */}
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 animate-bounce rounded-full bg-[#ff4500] dark:bg-[#ff6b35]"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
