import React, { useLayoutEffect, useRef } from "react"
import { TypeAnimation } from "react-type-animation"
import Button from "./Button"
import ResumeButton from "./ResumeButton"
import { useAbout } from "../contexts/AboutContext"
import circle from "../assets/userAsset/circle.png"
import cube from "../assets/userAsset/cube.png"
import dots from "../assets/userAsset/dots.png"
import plus from "../assets/userAsset/plus.png"
import zigzags from "../assets/userAsset/zigzags.png"
import { gsap } from "gsap"

const Hero = ({ loadingHook }) => {
  const { aboutInfo, loading, error, refetch } = useAbout()

  const profile = useRef(null)
  const cubeRef = useRef(null)
  const dotsRef = useRef(null)
  const plusRef = useRef(null)
  const zigzagsRef = useRef(null)
  const circleRef = useRef(null)

  // Update loading hook when loading state changes
  React.useEffect(() => {
    if (loadingHook) {
      loadingHook.setComponentLoading("hero", loading)
    }
  }, [loading, loadingHook.setComponentLoading])

  useLayoutEffect(() => {
    if (loading || !aboutInfo) return // Don't run until loading is false and aboutInfo is available

    // Small delay to ensure DOM elements are fully rendered
    const timer = setTimeout(() => {
      if (
        profile.current &&
        cubeRef.current &&
        dotsRef.current &&
        plusRef.current &&
        zigzagsRef.current &&
        circleRef.current
      ) {
        let ctx = gsap.context(() => {
          // Smoother animations with better easing
          gsap.fromTo(
            profile.current,
            { scale: 1 },
            {
              scale: 1.05,
              repeat: -1,
              yoyo: true,
              duration: 2,
              ease: "power2.inOut",
            },
          )
          gsap.to(cubeRef.current, {
            y: 30,
            rotateY: 360,
            repeat: -1,
            yoyo: true,
            duration: 3,
            ease: "power2.inOut",
          })
          gsap.to(dotsRef.current, {
            y: -15,
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: "power2.inOut",
          })
          gsap.to(plusRef.current, {
            y: -10,
            x: 10,
            repeat: -1,
            yoyo: true,
            duration: 2.8,
            ease: "power2.inOut",
          })
          gsap.to(zigzagsRef.current, {
            x: -10,
            y: -5,
            repeat: -1,
            yoyo: true,
            duration: 3.2,
            ease: "power2.inOut",
          })
          gsap.to(circleRef.current, {
            x: -15,
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 2.2,
            ease: "power2.inOut",
          })
        })
        return () => ctx.revert()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [loading, aboutInfo])

  if (loading) {
    return (
      <header className="relative mt-16 flex min-h-[400px] flex-col items-center justify-center gap-16 bg-gray-50 px-4 py-2 transition-colors duration-300 lg:flex-row lg:gap-0 lg:px-28 lg:pb-32 dark:bg-gray-800">
        <div className="text-center text-2xl text-gray-600 dark:text-gray-300">
          Loading about information...
        </div>
      </header>
    )
  }

  if (error) {
    return (
      <header className="relative mt-16 flex min-h-[400px] flex-col items-center justify-center gap-16 bg-gray-50 px-4 py-2 transition-colors duration-300 lg:flex-row lg:gap-0 lg:px-28 lg:pb-32 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-4 text-2xl text-red-600 dark:text-red-400">
            Error loading about information:
          </div>
          <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            {error}
          </div>
          <button
            onClick={refetch}
            className="rounded-lg bg-[#ff4500] px-6 py-3 text-white transition-colors duration-300 hover:bg-[#e03d00] dark:bg-[#ff6b35] dark:hover:bg-[#ff4500]"
          >
            Retry
          </button>
        </div>
      </header>
    )
  }

  if (!aboutInfo) {
    return (
      <header className="relative mt-16 flex min-h-[400px] flex-col items-center justify-center gap-16 bg-gray-50 px-4 py-2 transition-colors duration-300 lg:flex-row lg:gap-0 lg:px-28 lg:pb-32 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-4 text-2xl text-gray-600 dark:text-gray-300">
            No about information available
          </div>
          <div className="mb-6 text-lg text-gray-700 dark:text-gray-400">
            Please check the admin panel to add your information.
          </div>
        </div>
      </header>
    )
  }

  const displayName = aboutInfo.name
  const displayTitle = aboutInfo.title
  const displayDescription = aboutInfo.description
  const displayImage = aboutInfo.profileImage

  return (
    <header className="relative mt-16 flex flex-col justify-between gap-16 bg-gray-50 px-4 py-2 transition-colors duration-300 lg:flex-row lg:gap-0 lg:px-28 lg:pb-32 dark:bg-gray-800">
      <div className="flex w-full flex-col justify-center gap-5">
        <p className="text-4xl text-[#343d68] transition-colors duration-300 dark:text-gray-200">
          Hi! {displayName}
        </p>
        <p className="text-4xl text-[#343d68] transition-colors duration-300 dark:text-gray-200">
          I am a{" "}
          <TypeAnimation
            sequence={[
              displayTitle,
              4000,
              "Frontend Developer",
              5000,
              "Backend Developer",
              6000,
              "Full Stack Developer",
              7000,
            ]}
            wrapper="span"
            style={{ color: "#4e45d5" }}
            repeat={Infinity}
          />
        </p>
        <p className="mt-[112px] transition-colors duration-300 dark:text-gray-300">
          {displayDescription}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a href="#contact">
            <Button text={"Hire Me"} border={1} />
          </a>
          <ResumeButton
            resumeUrl={aboutInfo.resumeUrl}
            name={displayName}
            variant="download"
          />
        </div>
      </div>
      <div className="relative p-10">
        <img
          src={displayImage}
          alt="Profile"
          className=""
          ref={profile}
          onError={(e) => {
            console.log(e)
          }}
        />
        <img
          src={circle}
          alt="circle"
          className="absolute bottom-0"
          ref={circleRef}
        />
        <img
          src={cube}
          alt="cube"
          className="absolute right-0 top-0"
          ref={cubeRef}
        />
        <img
          src={dots}
          alt="dots"
          className="absolute bottom-0 right-0"
          ref={dotsRef}
        />
        <img
          src={plus}
          alt="plus"
          className="absolute left-1/2 top-0"
          ref={plusRef}
        />
        <img
          src={zigzags}
          alt="zigzags"
          className="absolute top-0"
          ref={zigzagsRef}
        />
        <span className="absolute -bottom-64 hidden text-[112px] text-[#e7e7e7] transition-colors duration-300 lg:-bottom-3 lg:left-2 lg:hidden dark:text-gray-700">
          {displayName.toLowerCase()}
        </span>
      </div>
      <span className="absolute hidden text-[112px] text-[#e7e7e7] transition-colors duration-300 lg:-bottom-3 lg:left-2 lg:block dark:text-gray-700">
        {displayName.toLowerCase()}
      </span>
    </header>
  )
}

export default Hero
