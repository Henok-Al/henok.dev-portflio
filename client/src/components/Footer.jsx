import React from "react"
import { BsGithub } from "react-icons/bs"
import { BsInstagram } from "react-icons/bs"
import { FaTwitter } from "react-icons/fa"
import { AiFillLinkedin } from "react-icons/ai"
import { FcDocument } from "react-icons/fc"

const handles = [
  "https://github.com/krishna4040",
  "https://www.linkedin.com/in/krishna-jain-842539205/",
  "https://twitter.com/krishna5048",
  "https://www.instagram.com/_its__krish_/",
  "https://portfolio-mailing.onrender.com/api/download",
]

const Footer = () => {
  return (
    <footer
      className="relative w-full overflow-hidden bg-[#343d68] px-10 py-20 transition-colors duration-300 lg:p-20 dark:bg-gray-900"
      role="contentinfo"
    >
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center">
        <ul className="flex gap-5 lg:flex-wrap lg:justify-between">
          <li>
            <a
              href="#projects"
              className="text-xl text-white transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              aria-label="Go to Projects section"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className="text-xl text-white transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              aria-label="Go to Skills section"
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-xl text-white transition-all duration-200 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]"
              aria-label="Go to Contact section"
            >
              Contact Me
            </a>
          </li>
        </ul>
        <div className="flex gap-5 lg:flex-wrap lg:gap-4">
          <a
            href={handles[0]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <BsGithub className="cursor-pointer text-4xl text-white transition-all duration-300 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]" />
          </a>
          <a
            href={handles[3]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profile"
          >
            <BsInstagram className="cursor-pointer text-4xl text-white transition-all duration-300 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]" />
          </a>
          <a
            href={handles[2]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter profile"
          >
            <FaTwitter className="cursor-pointer text-4xl text-white transition-all duration-300 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]" />
          </a>
          <a
            href={handles[1]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <AiFillLinkedin className="cursor-pointer text-4xl text-white transition-all duration-300 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]" />
          </a>
          <span className="tooltip bw top" data-tooltip="Download Resume">
            <a
              href={handles[4]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume"
            >
              <FcDocument className="cursor-pointer text-4xl text-white transition-all duration-300 hover:text-[#ff4500] dark:text-gray-200 dark:hover:text-[#ff6b35]" />
            </a>
          </span>
        </div>
        <span className="absolute bottom-0 left-0 -z-10 select-none text-7xl text-[#535c87] transition-colors duration-300 dark:text-gray-600">
          Krishna Jain
        </span>
      </div>
    </footer>
  )
}

export default Footer
