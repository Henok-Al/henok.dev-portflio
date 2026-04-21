import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { achievementsAPI } from "../services/api"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

// Import custom carousel styles
import "./AchievementsCarousel.css"

const AchievementsCarousel = () => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAchievements()
  }, [])

  const getSlidesPerView = (width) => {
    if (width < 768) return 1
    if (width < 1024) return 2
    return 3
  }

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await achievementsAPI.getAllAchievements()
      setAchievements(response.data.achievements)
    } catch (err) {
      setError("Failed to load achievements")
      console.error("Error fetching achievements:", err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      certification: "bg-blue-500",
      award: "bg-yellow-500",
      recognition: "bg-purple-500",
      event: "bg-green-500",
      achievement: "bg-red-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const getCategoryIcon = (category) => {
    const icons = {
      certification: "🏆",
      award: "🥇",
      recognition: "⭐",
      event: "🎉",
      achievement: "🎯",
    }
    return icons[category] || "📜"
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading achievements...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error || achievements.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Achievements & Recognition
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Celebrating milestones, certifications, and recognitions that mark
            my professional journey
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={Math.min(3, achievements.length)}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-prev-custom",
              prevEl: ".swiper-button-next-custom",
            }}
            loop={achievements.length > getSlidesPerView(window.innerWidth)}
            speed={300}
            allowTouchMove={true}
            grabCursor={true}
            slidesPerGroup={1}
            breakpoints={{
              320: {
                slidesPerView: Math.min(1, achievements.length),
                spaceBetween: 20,
              },
              768: {
                slidesPerView: Math.min(2, achievements.length),
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: Math.min(3, achievements.length),
                spaceBetween: 50,
              },
            }}
            className="achievements-swiper"
          >
            {achievements.map((achievement) => (
              <SwiperSlide key={achievement._id}>
                <div className="relative z-10 mx-auto flex h-[420px] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {/* Category Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${getCategoryColor(achievement.category)}`}
                    >
                      {getCategoryIcon(achievement.category)}{" "}
                      {achievement.category.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(achievement.date).getFullYear()}
                    </span>
                  </div>

                  {/* Achievement Image */}
                  <div className="relative mb-6 flex-shrink-0">
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="h-48 w-full rounded-lg object-cover shadow-md"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300"
                      }}
                    />
                    {achievement.certificateUrl && (
                      <a
                        href={achievement.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-2 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Achievement Details */}
                  <div className="flex-grow">
                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                      {achievement.title}
                    </h3>

                    {achievement.organization && (
                      <p className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                        {achievement.organization}
                      </p>
                    )}

                    <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>

                    {achievement.credentialId && (
                      <p className="mb-2 font-mono text-xs text-gray-500 dark:text-gray-500">
                        ID: {achievement.credentialId}
                      </p>
                    )}

                    {achievement.skills && achievement.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {achievement.skills
                            .slice(0, 2)
                            .map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          {achievement.skills.length > 2 && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              +{achievement.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="mt-auto flex-shrink-0 border-t border-gray-200 pt-3 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 text-gray-600 shadow-lg transition-all duration-300 hover:text-blue-600 hover:shadow-xl dark:bg-gray-800 dark:text-gray-400 dark:hover:text-blue-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <div className="swiper-button-next-custom absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 text-gray-600 shadow-lg transition-all duration-300 hover:text-blue-600 hover:shadow-xl dark:bg-gray-800 dark:text-gray-400 dark:hover:text-blue-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AchievementsCarousel
