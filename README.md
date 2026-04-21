# Dynamic Portfolio Application

A modern, dynamic portfolio application with admin panel and GitHub integration.

## Features

### Frontend

- **Dynamic Projects Display**: Featured projects on homepage, all projects on dedicated page
- **GitHub Integration**: Fetch and display projects from GitHub repositories
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Mode**: Theme switching capability
- **Routing**: Multi-page navigation with React Router

### Backend

- **Admin Panel**: Complete CRUD operations for projects, skills, work experience
- **Authentication**: JWT-based admin authentication
- **File Upload**: Cloudinary integration for media management
- **GitHub API Integration**: Fetch repository data automatically
- **Featured Projects Management**: Select up to 4 featured projects for homepage
- **Database**: MongoDB with Mongoose ODM
- **Email Integration**: Contact form with nodemailer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

2. **Environment Setup**

   **Frontend (.env)**

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend (.env)**

   ```
   # Backend Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   DB=mongodb://localhost:27017/portfolio
   PORT=5000
   BASE_URL=http://localhost:5000

   # Cloudinary Configuration (required for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Optional: GitHub Integration
   GITHUB_TOKEN=your_github_token

   # Optional: Email Configuration
   HOST=smtp.gmail.com
   USER=your-email@gmail.com
   PASS=your-app-password
   ```

3. **Cloudinary Setup** (Required for file uploads)
   - Create a free account at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Add them to your `.env` file
   - Test the connection: `npm run test-cloudinary`

4. **Database Setup**

   ```bash
   # Start MongoDB service
   # Create admin user
   npm run create-admin
   ```

5. **Testing** (Optional)

   ```bash
   # Test Cloudinary connection
   npm run test-cloudinary

   # Test project assets upload
   npm run test-project-assets

   # Test icon URL transformation
   npm run test-icons

   # Test upload path structure (verify no duplicate paths)
   npm run test-paths

   # Test media gallery functionality
   npm run test-media-gallery
   ```

6. **Start the application**

   **Development Mode:**

   ```bash
   # Start both frontend and backend with hot reload
   npm run dev
   ```

   **Production Mode:**

   ```bash
   # Build and start the application
   npm run build
   npm start
   ```

   **Using Docker:**

   ```bash
   # Using Docker Compose (recommended)
   npm run docker:compose:build

   # Or build and run manually
   npm run docker:build
   npm run docker:run
   ```

## Usage

### Admin Access

1. Navigate to `/admin`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

### Admin Panel Features

- **Project Management**: Add, edit, delete projects with media uploads
- **Skills Management**: Organize skills by categories with proficiency levels
- **Work Experience**: Manage employment history with company logo uploads
- **About Section**: Update personal information, profile image, and resume
- **GitHub Integration**: Import projects from GitHub repositories
- **Featured Projects**: Select up to 4 projects for homepage
- **File Upload**: Upload images, videos, and documents via Cloudinary
- **Visibility Control**: Show/hide content sections

## Technology Stack

### Frontend

- React 18, React Router DOM, Axios, Tailwind CSS, Vite

### Backend

- Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Cloudinary, Nodemailer

## File Upload System

This application uses **Cloudinary** for media management, providing:

- **Automatic Image Optimization**: Images are automatically optimized for web delivery
- **Responsive Images**: Multiple sizes generated automatically
- **Global CDN**: Fast delivery worldwide
- **Secure Storage**: HTTPS URLs with secure access
- **Transformation**: On-the-fly image transformations

### Supported File Types

- **Images**: JPG, PNG, GIF, WebP (for profile pictures and project images)
- **Documents**: PDF (for resumes)

### File Size Limits

- **Images**: 100MB per upload (for high-quality project assets)
- **Videos**: 100MB per upload (for project demos)
- **Documents**: 10MB per upload (for resumes)
- **Cloudinary free tier**: 25GB storage, 25GB monthly bandwidth

### Recent Fixes
- **Path Duplication Fix**: Resolved duplicate folder paths in Cloudinary URLs. See [CLOUDINARY_PATH_FIX.md](./CLOUDINARY_PATH_FIX.md) for details.
- **Media Gallery Enhancement**: Fixed video display and navigation in project galleries. See [MEDIA_GALLERY_FIX.md](./MEDIA_GALLERY_FIX.md) for details.

