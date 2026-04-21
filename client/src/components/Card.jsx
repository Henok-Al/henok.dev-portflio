import React from "react"
import { Link } from "react-router-dom"
import { FaGithub } from "react-icons/fa"
import { BiLink } from "react-icons/bi"

const Card = ({
  tech,
  title,
  desc,
  learn,
  background,
  align,
  number,
  github,
  link,
  projectId,
}) => {
  return (
    <div
      className={`group relative mx-auto flex h-[300px] w-full items-center justify-center bg-cover shadow-2xl before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10 before:origin-top-left before:scale-0 before:bg-gradient-to-br before:from-[#343d68] before:via-[#343d68be] before:to-[#343d687c] before:transition-all before:duration-500 before:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-0 after:bg-[#1f1f1f9a] after:content-[""] before:hover:scale-100 lg:h-[500px] lg:w-[90%] ${align === "left" ? "lg:ml-32" : ""}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className={`absolute z-[15] text-[200px] font-semibold text-white opacity-0 group-hover:opacity-100 ${align === "right" ? "right-[-45px] top-[-110px]" : "left-[-45px] top-[-110px]"} hidden lg:block`}
      >
        {number}
      </div>

      <div className="z-20 flex w-full scale-50 flex-col gap-4 p-6 transition-all duration-500 group-hover:scale-[0.65] lg:w-fit lg:scale-100 lg:p-8 lg:group-hover:scale-110">
        <div className="flex w-full flex-wrap lg:w-3/5">
          {tech &&
            tech.map((icon, index) => (
              <img
                src={icon.src || icon}
                alt={icon.alt || "tech"}
                key={index}
                width={39}
                className={`m-[10px]`}
              />
            ))}
        </div>
        <h3 className="text-5xl font-semibold leading-[3rem] text-white">
          {title}
        </h3>
        <p className="w-full italic text-white lg:w-[70%]">{desc}</p>
        <div className="flex items-center gap-4">
          <Link
            to={`/project/${projectId}`}
            className="relative z-10 w-fit bg-[#ff4500] px-9 py-3 text-white shadow-lg transition-all duration-700 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-[-1] before:origin-left before:scale-x-0 before:bg-white before:transition-all before:duration-700 before:content-[''] hover:bg-white hover:text-black before:hover:scale-x-100 dark:bg-[#ff6b35] dark:before:bg-gray-200 dark:hover:bg-gray-200"
          >
            Read More
          </Link>
          <a href={github} target="_blank" rel="noreferrer">
            <FaGithub className="cursor-pointer text-4xl text-white transition-all duration-500 hover:text-[#ff4500] dark:hover:text-[#ff6b35]" />
          </a>
          <a href={link} target="_blank" rel="noreferrer">
            <BiLink className="cursor-pointer text-4xl text-white transition-all duration-500 hover:text-[#ff4500] dark:hover:text-[#ff6b35]" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Card
