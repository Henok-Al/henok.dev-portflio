import { useState, useEffect, useCallback } from "react"

const useAppLoading = () => {
  const [loadingStates, setLoadingStates] = useState({
    hero: true,
    projects: true,
    skills: true,
    workExperience: true,
    contact: true,
  })

  const [isAppLoading, setIsAppLoading] = useState(true)
  const [startTime] = useState(Date.now())

  // Update individual loading states
  const setComponentLoading = useCallback((component, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [component]: isLoading,
    }))
  }, [])

  // Check if all components are loaded
  useEffect(() => {
    const allLoaded = Object.values(loadingStates).every((state) => !state)

    if (allLoaded && isAppLoading) {
      // Ensure preloader is visible for at least 5 seconds
      const elapsed = Date.now() - startTime
      const minDisplay = 4000
      const delay = Math.max(minDisplay - elapsed, 0)
      const timer = setTimeout(() => {
        setIsAppLoading(false)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [loadingStates, isAppLoading, startTime])

  // Get loading progress percentage
  const getLoadingProgress = useCallback(() => {
    const totalComponents = Object.keys(loadingStates).length
    const loadedComponents = Object.values(loadingStates).filter(
      (state) => !state,
    ).length
    return Math.round((loadedComponents / totalComponents) * 100)
  }, [loadingStates])

  // Get current loading message
  const getLoadingMessage = useCallback(() => {
    const progress = getLoadingProgress()

    if (progress < 20) return "Initializing portfolio..."
    if (progress < 40) return "Loading projects..."
    if (progress < 60) return "Fetching skills..."
    if (progress < 80) return "Loading experience..."
    if (progress < 100) return "Almost ready..."
    return "Finalizing..."
  }, [getLoadingProgress])

  return {
    isAppLoading,
    setComponentLoading,
    getLoadingProgress,
    getLoadingMessage,
    loadingStates,
  }
}

export default useAppLoading
