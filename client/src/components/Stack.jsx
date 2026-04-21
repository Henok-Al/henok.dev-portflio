import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { skillsAPI } from "../services/api"
import { useAbout } from "../contexts/AboutContext"
import blob from "../assets/userAsset/blobvector.png"

const Stack = ({ loadingHook }) => {
  const { aboutInfo } = useAbout()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const blobRef = useRef(null)

  useLayoutEffect(() => {
    if (!blobRef.current) return

    let ctx = gsap.context(() => {
      gsap.fromTo(
        blobRef.current,
        {
          x: 0,
          y: 0,
          rotation: 0,
        },
        {
          x: 20,
          y: -20,
          rotation: 360,
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: "power2.inOut",
        },
      )
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const skillsResponse = await skillsAPI.getAllSkills()
      setSkills(skillsResponse.data.skills || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
      setError(
        `Failed to fetch skills: ${error.response?.data?.message || error.message}`,
      )
      setSkills([])
    } finally {
      setLoading(false)
      if (loadingHook) {
        loadingHook.setComponentLoading("skills", false)
      }
    }
  }

  if (loading) {
    return (
      <section
        className="relative my-40 flex w-full flex-col gap-8 bg-white p-4 transition-colors duration-300 lg:flex-row lg:p-20 dark:bg-gray-900"
        id="skills"
      >
        <div className="text-center text-2xl text-gray-600 dark:text-gray-300">
          Loading skills...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="relative my-40 flex w-full flex-col gap-8 bg-white p-4 transition-colors duration-300 lg:flex-row lg:p-20 dark:bg-gray-900"
        id="skills"
      >
        <div className="text-center">
          <div className="mb-4 text-2xl text-red-600 dark:text-red-400">
            Error loading skills:
          </div>
          <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            {error}
          </div>
          <button
            onClick={fetchData}
            className="rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative my-40 flex w-full flex-col gap-8 bg-white p-4 transition-colors duration-300 lg:flex-row lg:p-20 dark:bg-gray-900"
      id="skills"
    >
      <div className="flex w-full flex-col lg:w-1/2">
        <h4 className="text-5xl font-semibold text-[#ff4500] transition-colors duration-300 dark:text-[#ff6b35]">
          <span className="text-8xl">M</span>e and <br /> My Tech Stack
        </h4>
        <div className="mt-4 w-full text-justify lg:w-5/6">
          {aboutInfo ? (
            <div className="space-y-4">
              <p className="m-4 transition-colors duration-300 dark:text-gray-300">
                <em>Hello there!</em> I'm {aboutInfo.name},{" "}
                {aboutInfo.title.toLowerCase()} on a mission to craft
                user-centric and robust applications.
              </p>
              <p className="m-4 transition-colors duration-300 dark:text-gray-300">
                {aboutInfo.bio}
              </p>
              <p className="m-4 transition-colors duration-300 dark:text-gray-300">
                Ready to turn ideas into reality, I bring a blend of creativity
                and precision to the code game. Let's build something amazing
                together, shall we?
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="m-4 text-red-600 dark:text-red-400">
                No about information available. Please check the admin panel to
                add your information.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex w-full flex-wrap justify-center gap-8 lg:w-[40%]">
        {skills.length > 0 ? (
          skills.slice(0, 20).map((skill) => (
            <div key={skill._id} className="group relative">
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-20 transition-all duration-500 hover:scale-125 lg:w-[85px]"
                onError={(e) => {
                  e.target.src = "/assets/stack/default.png"
                }}
              />
              <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-600">
                {skill.name}
                <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-2 border-transparent border-t-gray-800 dark:border-t-gray-600"></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>No skills available.</p>
            <p className="mt-2 text-sm">
              Please check the admin panel to add skills.
            </p>
          </div>
        )}
        <img
          ref={blobRef}
          src={blob}
          alt="blob"
          className="absolute left-1/2 top-1/2 z-[-1] translate-x-[-50%] translate-y-[-50%]"
        />
      </div>
      <span className="absolute bottom-[-31.5%] right-3 hidden select-none text-[14rem] font-semibold text-[#e7e7e7] transition-colors duration-300 lg:block dark:text-gray-700">
        Skills
      </span>
    </section>
  )
}

export default Stack
