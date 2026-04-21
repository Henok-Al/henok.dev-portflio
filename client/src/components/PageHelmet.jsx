import React from "react"
import { Helmet } from "react-helmet"
import { useAbout } from "../contexts/AboutContext"

const PageHelmet = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  keywords = [],
  type = "website",
}) => {
  const { aboutInfo } = useAbout()

  // Default fallback values
  const defaultTitle = "Krishna Jain | Full Stack Developer"
  const defaultDescription =
    "Portfolio of Krishna Jain, a full stack developer specializing in modern web applications."
  const defaultOgImage =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  const defaultUrl = "https://krishnajain.site/"

  // Use provided values or construct from aboutInfo or use defaults
  const pageTitle =
    title ||
    (aboutInfo?.name && aboutInfo?.title
      ? `${aboutInfo.name} | ${aboutInfo.title}`
      : defaultTitle)

  const pageDescription =
    description || aboutInfo?.description || defaultDescription

  const pageOgTitle =
    ogTitle || (aboutInfo?.name ? `${aboutInfo.name} Portfolio` : pageTitle)

  const pageOgDescription = ogDescription || aboutInfo?.bio || pageDescription

  const pageOgImage = ogImage || aboutInfo?.profileImage || defaultOgImage

  const pageKeywords = [
    aboutInfo?.name || "Krishna Jain",
    aboutInfo?.title || "Full Stack Developer",
    "portfolio",
    "web developer",
    "software engineer",
    ...keywords,
  ].join(", ")

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageOgTitle} />
      <meta property="og:description" content={pageOgDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={defaultUrl} />
      <meta property="og:image" content={pageOgImage} />

      {/* Additional meta tags for better SEO */}
      <meta name="author" content={aboutInfo?.name || "Krishna Jain"} />
      <meta name="keywords" content={pageKeywords} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageOgTitle} />
      <meta name="twitter:description" content={pageOgDescription} />
      <meta name="twitter:image" content={pageOgImage} />
      {aboutInfo?.socialLinks?.twitter && (
        <meta
          name="twitter:creator"
          content={`@${aboutInfo.socialLinks.twitter.replace("https://twitter.com/", "").replace("https://x.com/", "")}`}
        />
      )}
    </Helmet>
  )
}

export default PageHelmet
