import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Stack from "./components/Stack"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import AllProjects from "./components/AllProjects"
import ProjectDetail from "./components/ProjectDetail"
import WorkExperience from "./components/WorkExperience"
import AchievementsCarousel from "./components/AchievementsCarousel"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import NotFound from "./components/NotFound"
import Preloader from "./components/Preloader"
import useAppLoading from "./hooks/useAppLoading"
import DynamicHelmet from "./components/DynamicHelmet"
import { AboutProvider } from "./contexts/AboutContext"

const HomePage = ({ isDark, setIsDark }) => {
  const loadingHook = useAppLoading()

  return (
    <>
      {/* Preloader only for homepage */}
      <Preloader
        isLoading={loadingHook.isAppLoading}
        loadingText={loadingHook.getLoadingMessage()}
        progress={loadingHook.getLoadingProgress()}
      />

      <div
        className={`${isDark ? "dark" : ""} min-h-screen w-full overflow-y-auto overflow-x-hidden bg-white transition-colors duration-300 dark:bg-gray-900`}
      >
        <div className="bg-white transition-colors duration-300 dark:bg-gray-900">
          <Navbar isDark={isDark} setIsDark={setIsDark} />
          <Hero loadingHook={loadingHook} />
          <Projects loadingHook={loadingHook} />
          <Stack loadingHook={loadingHook} />
          <WorkExperience loadingHook={loadingHook} />
          <AchievementsCarousel />
          <Contact loadingHook={loadingHook} />
          <Footer />
        </div>
      </div>
    </>
  )
}

const AppShell = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    return saved ? JSON.parse(saved) : false
  })

  // Save dark mode preference to localStorage
  React.useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark))
  }, [isDark])

  return (
    <AboutProvider>
      <DynamicHelmet />
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only absolute left-0 top-0 z-50 bg-[#ff4500] p-2 text-white focus:not-sr-only"
      >
        Skip to main content
      </a>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <main id="main-content" role="main" aria-label="Main content">
                <HomePage isDark={isDark} setIsDark={setIsDark} />
              </main>
            }
          />
          <Route
            path="/projects"
            element={
              <div
                className={`${isDark ? "dark" : ""} min-h-screen w-full overflow-y-auto overflow-x-hidden bg-white transition-colors duration-300 dark:bg-gray-900`}
              >
                <div className="bg-white transition-colors duration-300 dark:bg-gray-900">
                  <Navbar isDark={isDark} setIsDark={setIsDark} />
                  <AllProjects />
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/project/:id"
            element={
              <div
                className={`${isDark ? "dark" : ""} min-h-screen w-full overflow-y-auto overflow-x-hidden bg-white transition-colors duration-300 dark:bg-gray-900`}
              >
                <div className="bg-white transition-colors duration-300 dark:bg-gray-900">
                  <Navbar isDark={isDark} setIsDark={setIsDark} />
                  <ProjectDetail />
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div
                className={`${isDark ? "dark" : ""} min-h-screen w-full bg-white transition-colors duration-300 dark:bg-gray-900`}
              >
                <div className="bg-white transition-colors duration-300 dark:bg-gray-900">
                  <Navbar isDark={isDark} setIsDark={setIsDark} />
                  <AdminLogin />
                </div>
              </div>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <div
                className={`${isDark ? "dark" : ""} min-h-screen w-full bg-white transition-colors duration-300 dark:bg-gray-900`}
              >
                <div className="bg-white transition-colors duration-300 dark:bg-gray-900">
                  <Navbar isDark={isDark} setIsDark={setIsDark} />
                  <AdminDashboard />
                </div>
              </div>
            }
          />
          {/* 404 Not Found - This should be the last route */}
          <Route
            path="*"
            element={
              <div
                className={`${isDark ? "dark" : ""} min-h-screen w-full bg-white transition-colors duration-300 dark:bg-gray-900`}
              >
                <NotFound />
              </div>
            }
          />
        </Routes>
      </Router>
    </AboutProvider>
  )
}

export default AppShell
