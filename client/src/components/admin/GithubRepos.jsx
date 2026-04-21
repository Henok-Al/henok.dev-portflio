import React, { useState, useEffect } from "react"
import { projectsAPI } from "../../services/api"

const GithubRepos = ({ onProjectCreated }) => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedRepos, setSelectedRepos] = useState([])

  useEffect(() => {
    fetchGithubRepos()
  }, [])

  const fetchGithubRepos = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await projectsAPI.getGithubRepos()
      setRepos(response.data.repos)
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch GitHub repositories",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRepoSelect = (repo) => {
    // Prevent selection of already imported repos
    if (repo.isImported) {
      return
    }
    
    setSelectedRepos((prev) => {
      const isSelected = prev.find((r) => r.id === repo.id)
      if (isSelected) {
        return prev.filter((r) => r.id !== repo.id)
      } else {
        return [...prev, repo]
      }
    })
  }

  // Technology mapping for better icons
  const getTechnologyIcon = (techName) => {
    const techMap = {
      // Frontend
      react: "react/react-original.svg",
      vue: "vuejs/vuejs-original.svg",
      angular: "angularjs/angularjs-original.svg",
      svelte: "svelte/svelte-original.svg",
      javascript: "javascript/javascript-original.svg",
      typescript: "typescript/typescript-original.svg",
      html: "html5/html5-original.svg",
      css: "css3/css3-original.svg",
      sass: "sass/sass-original.svg",
      tailwind: "tailwindcss/tailwindcss-original.svg",
      bootstrap: "bootstrap/bootstrap-original.svg",

      // Backend
      nodejs: "nodejs/nodejs-original.svg",
      express: "express/express-original.svg",
      nestjs: "nestjs/nestjs-original.svg",
      python: "python/python-original.svg",
      django: "django/django-plain.svg",
      flask: "flask/flask-original.svg",
      java: "java/java-original.svg",
      spring: "spring/spring-original.svg",
      php: "php/php-original.svg",
      laravel: "laravel/laravel-original.svg",
      ruby: "ruby/ruby-original.svg",
      rails: "rails/rails-original-wordmark.svg",
      go: "go/go-original.svg",
      rust: "rust/rust-original.svg",
      csharp: "csharp/csharp-original.svg",
      dotnet: "dot-net/dot-net-original.svg",

      // Databases
      mongodb: "mongodb/mongodb-original.svg",
      mysql: "mysql/mysql-original.svg",
      postgresql: "postgresql/postgresql-original.svg",
      redis: "redis/redis-original.svg",
      sqlite: "sqlite/sqlite-original.svg",

      // Tools & Others
      docker: "docker/docker-original.svg",
      kubernetes: "kubernetes/kubernetes-original.svg",
      git: "git/git-original.svg",
      webpack: "webpack/webpack-original.svg",
      vite: "vitejs/vitejs-original.svg",
      firebase: "firebase/firebase-original.svg",
      aws: "amazonwebservices/amazonwebservices-original-wordmark.svg",
      azure: "azure/azure-original.svg",
      gcp: "googlecloud/googlecloud-original.svg",
      vercel: "vercel/vercel-original.svg",
      netlify: "netlify/netlify-original.svg",
      heroku: "heroku/heroku-original.svg",
      nextjs: "nextjs/nextjs-original.svg",
      nuxtjs: "nuxtjs/nuxtjs-original.svg",
      gatsby: "gatsby/gatsby-original.svg",
      graphql: "graphql/graphql-plain.svg",
      apollo: "apollographql/apollographql-original.svg",
      redux: "redux/redux-original.svg",
      socketio: "socketio/socketio-original.svg",
      electron: "electron/electron-original.svg",
      flutter: "flutter/flutter-original.svg",
      dart: "dart/dart-original.svg",
      swift: "swift/swift-original.svg",
      kotlin: "kotlin/kotlin-original.svg",
      android: "android/android-original.svg",
      ios: "apple/apple-original.svg",
    }

    const normalizedName = techName.toLowerCase().replace(/[^a-z0-9]/g, "")
    return techMap[normalizedName]
      ? `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${techMap[normalizedName]}`
      : `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg`
  }

  // Generate smart features based on repo data
  const generateFeatures = (repo) => {
    const features = []

    if (repo.description) {
      features.push(`${repo.description}`)
    }

    if (repo.language) {
      features.push(`Built with ${repo.language}`)
    }

    if (repo.topics && repo.topics.length > 0) {
      features.push(`Technologies: ${repo.topics.slice(0, 3).join(", ")}`)
    }

    if (repo.stargazers_count > 0) {
      features.push(`${repo.stargazers_count} GitHub stars`)
    }

    if (repo.forks_count > 0) {
      features.push(`${repo.forks_count} forks from the community`)
    }

    if (repo.open_issues_count !== undefined) {
      features.push(
        `Active development with ${repo.open_issues_count} open issues`,
      )
    }

    // Add some generic features based on common patterns
    if (repo.name.toLowerCase().includes("api")) {
      features.push("RESTful API endpoints")
    }
    if (
      repo.name.toLowerCase().includes("app") ||
      repo.name.toLowerCase().includes("web")
    ) {
      features.push("Responsive web application")
    }
    if (
      repo.topics?.includes("react") ||
      repo.topics?.includes("vue") ||
      repo.topics?.includes("angular")
    ) {
      features.push("Modern frontend framework")
    }
    if (repo.topics?.includes("nodejs") || repo.topics?.includes("express")) {
      features.push("Backend API development")
    }
    if (
      repo.topics?.includes("mongodb") ||
      repo.topics?.includes("mysql") ||
      repo.topics?.includes("postgresql")
    ) {
      features.push("Database integration")
    }

    return features.slice(0, 6) // Limit to 6 features
  }

  // Generate project status based on repo activity
  const getProjectStatus = (repo) => {
    const lastUpdate = new Date(repo.updated_at)
    const now = new Date()
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24)

    if (daysSinceUpdate < 30) {
      return "in-progress"
    } else if (daysSinceUpdate < 90) {
      return "completed"
    } else {
      return "completed" // Assume older projects are completed
    }
  }

  const createProjectsFromRepos = async () => {
    if (selectedRepos.length === 0) {
      alert("Please select at least one repository")
      return
    }

    try {
      setLoading(true)
      for (const repo of selectedRepos) {
        // Enhanced project data with all new fields
        const projectData = {
          title: repo.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          description:
            repo.description || `A ${repo.language || "software"} project`,
          shortDescription: repo.description
            ? repo.description.length > 100
              ? repo.description.substring(0, 100) + "..."
              : repo.description
            : `${repo.language || "Software"} project from GitHub`,
          longDescription: repo.description
            ? `${repo.description}\n\nThis project was imported from GitHub and showcases ${repo.language || "modern"} development practices. ${repo.topics && repo.topics.length > 0 ? `Built using technologies including ${repo.topics.join(", ")}.` : ""} ${repo.stargazers_count > 0 ? `The project has gained ${repo.stargazers_count} stars on GitHub, demonstrating its value to the developer community.` : ""}`
            : `This ${repo.language || "software"} project demonstrates modern development practices and clean code architecture. Imported from GitHub repository for portfolio showcase.`,
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || "",
          youtubeUrl: "", // Empty by default, can be filled manually later
          imageUrl: "", // Will be auto-generated by backend
          images: [], // Empty by default, can be added manually later
          videos: [], // Empty by default, can be added manually later
          features: generateFeatures(repo),
          collaborators: [repo.owner?.login || "GitHub User"], // Add repo owner as collaborator
          startDate: new Date(repo.created_at),
          endDate:
            getProjectStatus(repo) === "completed"
              ? new Date(repo.updated_at)
              : null,
          status: getProjectStatus(repo),
          technologies:
            repo.topics?.map((topic) => ({
              name: topic.charAt(0).toUpperCase() + topic.slice(1),
              icon: getTechnologyIcon(topic),
            })) ||
            (repo.language
              ? [
                  {
                    name: repo.language,
                    icon: getTechnologyIcon(repo.language),
                  },
                ]
              : []),
          githubData: {
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            language: repo.language || "Unknown",
            lastUpdated: new Date(repo.updated_at),
          },
          isVisible: true,
          isFeatured: false,
        }

        await projectsAPI.createProject(projectData)
      }

      setSelectedRepos([])
      onProjectCreated()
      alert(
        `Successfully created ${selectedRepos.length} enhanced projects with full details!`,
      )
    } catch (error) {
      console.error("Error creating projects:", error)
      alert("Failed to create projects from repositories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && repos.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
        <div className="text-center dark:text-white">
          Loading GitHub repositories...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-gray-700">
        <div className="text-center text-red-600 dark:text-red-400">
          {error}
          <button
            onClick={fetchGithubRepos}
            className="mx-auto mt-4 block rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white shadow transition-colors duration-300 dark:bg-gray-700">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">
            GitHub Repositories
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Selected: {selectedRepos.length}
            </span>
            <button
              onClick={createProjectsFromRepos}
              disabled={loading || selectedRepos.length === 0}
              className="rounded bg-green-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {loading ? "Creating..." : "Create Enhanced Projects"}
            </button>
            <button
              onClick={fetchGithubRepos}
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>

        {selectedRepos.length > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
              Enhanced Import Preview:
            </h3>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <p>• Auto-generated project descriptions and features</p>
              <p>• Smart technology mapping with proper icons</p>
              <p>• GitHub statistics (stars, forks, language)</p>
              <p>• Project timeline based on repository dates</p>
              <p>• Intelligent status detection</p>
              <p>• Repository owner as collaborator</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {repos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No repositories found. Make sure you have public repositories in
            your GitHub account.
          </div>
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className={`flex items-start justify-between rounded-lg border p-4 transition-colors duration-200 ${
                  repo.isImported
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!selectedRepos.find((r) => r.id === repo.id)}
                      onChange={() => handleRepoSelect(repo)}
                      disabled={repo.isImported}
                      className="mr-2 disabled:opacity-50"
                    />
                    <h3 className={`text-lg font-medium ${
                      repo.isImported 
                        ? "text-green-800 dark:text-green-200" 
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {repo.name}
                    </h3>
                    {repo.isImported && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-200">
                        ✓ Imported as "{repo.existingProject?.title}"
                      </span>
                    )}
                    {repo.language && (
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {repo.description || "No description available"}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                    <span>
                      Updated: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {repo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GithubRepos
