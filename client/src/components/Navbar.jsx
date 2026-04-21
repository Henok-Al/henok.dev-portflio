import React from "react"
import { Link, useLocation } from "react-router-dom"
import kLogo from "../assets/userAsset/k.png"
import { BsFillMoonFill, BsSunFill } from "react-icons/bs"
import { FaDownload } from "react-icons/fa"
import { useAbout } from "../contexts/AboutContext"
import { downloadResume } from "../utils/downloadUtils"

const Navbar = ({ isDark, setIsDark }) => {
  const { aboutInfo } = useAbout()
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  const isAdminPage = location.pathname.startsWith("/admin")

  const handleResumeDownload = async () => {
    if (aboutInfo?.resumeUrl) {
      await downloadResume(aboutInfo.resumeUrl, aboutInfo.name)
    }
  }

  return (
    <nav
      className="flex w-full flex-col items-center justify-between bg-white p-4 transition-colors duration-300 lg:flex-row dark:bg-gray-900"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="relative w-full">
        <Link to="/">
          <img src={kLogo} alt="K" className="w-24" />
          <span className="absolute left-16 top-7 w-full text-[28px] transition-colors duration-300 dark:text-white">
            rishna Jain
          </span>
        </Link>
      </div>

      <ul className="flex w-full items-center justify-end gap-7 text-right">
        {isAdminPage ? (
          <>
            <li>
              <Link
                to="/"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Back to Portfolio
              </Link>
            </li>
          </>
        ) : isHomePage ? (
          <>
            <li>
              <a
                href="#projects"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hidden text-xl transition-all duration-200 hover:text-[#ff4500] md:inline dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Contact Me
              </a>
            </li>
            {aboutInfo?.resumeUrl && (
              <li>
                <button
                  onClick={handleResumeDownload}
                  className="flex items-center gap-2 text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
                  title="Download Resume"
                >
                  <FaDownload className="text-sm" />
                  <span className="hidden sm:inline">Resume</span>
                </button>
              </li>
            )}
            <li>
              <Link
                to="/admin"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Admin
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                All Projects
              </Link>
            </li>
            {aboutInfo?.resumeUrl && (
              <li>
                <button
                  onClick={handleResumeDownload}
                  className="flex items-center gap-2 text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
                  title="Download Resume"
                >
                  <FaDownload className="text-sm" />
                  <span className="hidden sm:inline">Resume</span>
                </button>
              </li>
            )}
            <li>
              <Link
                to="/admin"
                className="text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              >
                Admin
              </Link>
            </li>
          </>
        )}
        <li
          className="cursor-pointer text-xl transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
          onClick={() => {
            setIsDark((prev) => !prev)
          }}
        >
          {isDark ? <BsSunFill /> : <BsFillMoonFill />}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
