# Deployment Guide: Vercel (Frontend) + Render (Backend)

## Prerequisites
- GitHub repo pushed with latest code
- MongoDB Atlas cluster running
- Cloudinary account
- Vercel account (free tier works)
- Render account (free tier works)

---

## Step 1: Fix Code for Separate Deployments

### 1a. Add CORS to `server/index.js`

The `cors` package is installed but never used. Add it so the Vercel frontend can call the Render backend:

```js
import cors from "cors"

// Add BEFORE route definitions
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}))
```

### 1b. Remove deprecated Mongoose options (already done)

`useNewUrlParser` and `useUnifiedTopology` are ignored in Mongoose 7+.

---

## Step 2: Deploy Backend on Render

### 2a. Push code to GitHub

```bash
git add .
git commit -m "prepare for vercel + render deployment"
git push
```

### 2b. Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `portfolio-api`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `master`
   - **Runtime:** Node
   - **Build Command:**
     ```
     npm install
     ```
   - **Start Command:**
     ```
     npm start
     ```
   - **Plan:** Free

### 2c. Set Environment Variables on Render

Go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DB` | `mongodb+srv://<db_user>:<db_password>@cluster0.vtthyeh.mongodb.net/` |
| `JWT_SECRET` | `<your-jwt-secret>` |
| `CLOUDINARY_CLOUD_NAME` | `<your-cloud-name>` |
| `CLOUDINARY_API_KEY` | `<your-api-key>` |
| `CLOUDINARY_API_SECRET` | `<your-api-secret>` |
| `HOST` | `smtp.gmail.com` |
| `USER` | `<your-email@gmail.com>` |
| `PASS` | `<your-app-password>` |
| `GITHUB_TOKEN` | `<your-github-pat>` |
| `CLIENT_URL` | *(set after Vercel deploy — see Step 3c)* |

### 2d. Deploy

Click **"Create Web Service"**. Render will build and deploy. Your API will be live at:
```
https://portfolio-api.onrender.com
```

### 2e. Seed Admin User

After first deploy, go to Render **Shell** tab and run:
```bash
node scripts/createAdmin.js
```

---

## Step 3: Deploy Frontend on Vercel

### 3a. Create `vercel.json` in project root

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3b. Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3c. Set Environment Variables on Vercel

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://portfolio-api.onrender.com/api` |

### 3d. Deploy

Click **"Deploy"**. Your frontend will be live at:
```
https://your-project.vercel.app
```

### 3e. Update Render CORS

Go back to Render → Environment → add/update:
```
CLIENT_URL=https://your-project.vercel.app
```

Render will auto-redeploy.

---

## Step 4: Verify

1. Open `https://your-project.vercel.app`
2. Check that skills, about, work experience load (no 500 errors)
3. Test admin login at `/admin`
4. Test contact form submission

---

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
DB=mongodb+srv://<db_user>:<db_password>@cluster0.vtthyeh.mongodb.net/
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
HOST=smtp.gmail.com
USER=<your-email@gmail.com>
PASS=<your-app-password>
GITHUB_TOKEN=<your-github-pat>
CLIENT_URL=https://your-project.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://portfolio-api.onrender.com/api
```

---

## Troubleshooting

- **CORS errors**: Make sure `CLIENT_URL` on Render matches your exact Vercel URL (with `https://`)
- **500 errors**: Check Render logs, ensure `DB` connection string is correct
- **Blank page**: Check Vercel build logs, ensure `VITE_API_URL` is set correctly
- **Admin login fails**: Run `node scripts/createAdmin.js` in Render Shell
