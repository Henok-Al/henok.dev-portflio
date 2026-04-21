import axios from "axios"

export const fetchGithubRepos = async (username) => {
  try {
    const headers = {}
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
    }
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers },
    )
    return response.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      topics: repo.topics,
    }))
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    throw new Error("Failed to fetch GitHub repositories")
  }
}

export const fetchGithubRepoDetails = async (username, repoName) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}`,
    )
    return {
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language,
      lastUpdated: response.data.updated_at,
    }
  } catch (error) {
    console.error("Error fetching GitHub repo details:", error)
    return {
      stars: 0,
      forks: 0,
      language: "",
      lastUpdated: new Date(),
    }
  }
}
