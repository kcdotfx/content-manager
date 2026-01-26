# Content Planner App - Full Stack Deployment Ready

A modern, full-stack content planning application built with React, FastAPI, and MongoDB.

## ✅ Application Status: Ready for Deployment

The application has been configured for online deployment and is tested locally.

### Backend Status
- ✅ FastAPI server running on `http://localhost:8000`
- ✅ API health check: `http://localhost:8000/api/health` → `{"status":"ok"}`
- ✅ MongoDB integration configured
- ✅ CORS enabled for frontend communication
- ✅ Deployment files: `Procfile`, `vercel.json`, `.vercelignore`

### Frontend Status
- ✅ React app running on `http://localhost:3000`
- ✅ Production build successful (187 KB optimized)
- ✅ Environment configuration set up
- ✅ Netlify deployment configured: `netlify.toml`, `.netlifyignore`

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or MongoDB Atlas)

### Setup & Run

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn server:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Visit: http://localhost:3000

## Deployment Guide

### 🚀 Frontend Deployment (Netlify)

1. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your GitHub repository
   - Base directory: `frontend/`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

2. **Set Environment Variables in Netlify**
   ```
   REACT_APP_BACKEND_URL = https://your-backend-api.com
   ```

3. **Deploy** - Netlify automatically deploys on push

### 🚀 Backend Deployment (Render / Heroku)

**Option A: Render (Recommended)**
1. Go to https://render.com
2. Create "New Web Service"
3. Connect your GitHub repository
4. Set root directory to `backend/`
5. Runtime: Python 3.11
6. Build command: `pip install -r requirements.txt`
7. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Environment Variables to Add:**
```
MONGO_URL = mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME = test_database
CORS_ORIGINS = https://your-netlify-url.netlify.app
```

**Option B: Heroku**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set MONGO_URL=mongodb+srv://...
```

### 🗄️ Database Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to backend environment: `MONGO_URL`

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── pages/          # Route pages (Dashboard, Ideas, Kanban, Calendar)
│   │   ├── components/     # React components
│   │   ├── lib/           # API calls, utilities
│   │   └── App.js         # Main app with routing
│   ├── netlify.toml       # ✅ Netlify deployment config
│   ├── .env.development   # ✅ Local environment
│   ├── .env.production    # ✅ Production environment
│   └── package.json
│
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile           # ✅ Heroku deployment config
│   ├── vercel.json        # ✅ Vercel/serverless config
│   ├── .env               # Local environment
│   └── .vercelignore      # ✅ Deployment ignore rules
│
├── docker-compose.yml     # Local development with Docker
└── DEPLOY.md              # ✅ Detailed deployment guide
```

## Features

- 📝 **Content Planning**: Create, edit, and manage content posts
- 🎯 **Kanban Board**: Visualize content workflow
- 📅 **Calendar View**: Schedule content
- 🏷️ **Tagging System**: Organize content with tags
- 📊 **Dashboard**: Analytics and overview
- 🔍 **Search & Filter**: Find content quickly
- 🎨 **Modern UI**: Built with Shadcn/ui + Tailwind CSS

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/health/ready` - Database readiness
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/{id}` - Get post details
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `PATCH /api/posts/{id}/status` - Update status
- `GET /api/stats` - Dashboard statistics
- `GET /api/tags` - Get all tags

## Tech Stack

**Frontend:**
- React 18
- React Router v7
- Tailwind CSS
- Shadcn/ui Components
- Recharts (Analytics)
- Hello Pangea DND (Drag & Drop)

**Backend:**
- FastAPI
- Motor (Async MongoDB)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

**Database:**
- MongoDB (Atlas recommended)

**Deployment:**
- Frontend: Netlify
- Backend: Render/Heroku
- Database: MongoDB Atlas

## Deployment Checklist

- [ ] Fork/clone the repository
- [ ] Create MongoDB Atlas account and cluster
- [ ] Get MongoDB connection string
- [ ] Deploy backend to Render/Heroku
- [ ] Add backend environment variables
- [ ] Deploy frontend to Netlify
- [ ] Add `REACT_APP_BACKEND_URL` to Netlify
- [ ] Trigger frontend rebuild
- [ ] Test application at deployed URLs
- [ ] Update backend `CORS_ORIGINS` with frontend URL

## Environment Variables

**Frontend (.env.production):**
```
REACT_APP_BACKEND_URL=https://your-backend-api.onrender.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=true
```

**Backend:**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=test_database
CORS_ORIGINS=https://your-site.netlify.app
```

## Troubleshooting

**CORS Errors:**
- Update backend `CORS_ORIGINS` environment variable to match frontend URL

**API Connection Issues:**
- Verify `REACT_APP_BACKEND_URL` is set correctly in frontend
- Test backend health: `https://your-api.onrender.com/api/health`

**Database Connection Errors:**
- Verify MongoDB connection string
- Ensure MongoDB IP whitelist includes your server's IP
- Check `MONGO_URL` environment variable is set

**Build Failures:**
- Check Node.js version (need 18+)
- Verify all dependencies installed: `npm install`
- Check for environment variable issues

## Local Testing Commands

```bash
# Test backend health
curl http://localhost:8000/api/health

# Test creating a post
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","platform":"instagram","content_type":"reel","status":"idea"}'

# Get all posts
curl http://localhost:8000/api/posts
```

## Performance Optimizations

- ✅ Frontend build optimized (187 KB gzipped)
- ✅ Code splitting enabled
- ✅ CSS modules with Tailwind
- ✅ Async database operations
- ✅ CORS configured
- ✅ Health check endpoints

## Next Steps

1. **Read [DEPLOY.md](./DEPLOY.md)** for detailed deployment instructions
2. **Set up MongoDB Atlas** for your database
3. **Deploy backend** to Render or Heroku
4. **Deploy frontend** to Netlify
5. **Test the application** at your deployed URLs

## Support & Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Router Docs](https://reactrouter.com)
- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [MongoDB Docs](https://docs.mongodb.com)

---

**Status**: ✅ Ready for Production Deployment

**Last Updated**: January 25, 2026

**Application Version**: 0.1.0
