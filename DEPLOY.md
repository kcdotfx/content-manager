# Content Planner App - Deployment Guide

This guide covers deploying both the frontend and backend of the Content Planner App.

## Frontend Deployment (React) - Netlify

### Prerequisites
- Netlify account (free at https://www.netlify.com)
- GitHub account with the repository

### Quick Deploy to Netlify

1. **Connect GitHub Repository**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Authorize Netlify with GitHub
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Base directory: `frontend/`

3. **Set Environment Variables**
   In Netlify dashboard:
   - Go to Site Settings → Build & Deploy → Environment
   - Add: `REACT_APP_BACKEND_URL=` (your backend API URL)
   - Example: `https://your-backend-api.render.com`

4. **Deploy**
   - Netlify will automatically deploy whenever you push to your main branch
   - Your site will be available at: `https://your-site-name.netlify.app`

### Important: Backend URL Configuration

The frontend needs to know where your backend API is located:

- **Development**: Uses `http://localhost:8000` (from `.env.development`)
- **Production**: Set `REACT_APP_BACKEND_URL` in Netlify environment variables

## Backend Deployment (Python FastAPI)

### Option 1: Deploy to Render (Recommended)

#### Steps:
1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend/` as the root directory

3. **Configure Service**
   - **Name**: Choose a name (e.g., "content-planner-api")
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   - `MONGO_URL`: Your MongoDB connection string (from Atlas)
   - `DB_NAME`: `test_database` (or your database name)
   - `CORS_ORIGINS`: `*` (or specify Netlify domain)
   - Note: Update later to match your Netlify frontend URL

5. **Connect Database**
   - Use MongoDB Atlas (free at https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Add connection string to `MONGO_URL` environment variable

6. **Deploy**
   - Render will automatically deploy
   - Your API will be at: `https://your-api-name.onrender.com`

### Option 2: Deploy to Heroku (Free tier deprecated, but alternative)

1. **Prepare for Heroku**
   - Ensure `Procfile` exists in `backend/` directory
   - File should contain: `web: uvicorn server:app --host 0.0.0.0 --port $PORT`

2. **Deploy Using Git**
   ```bash
   # Install Heroku CLI
   # Then:
   heroku login
   heroku create your-app-name
   heroku config:set MONGO_URL=mongodb+srv://...
   heroku config:set DB_NAME=test_database
   git push heroku main
   ```

### Option 3: Deploy to Railway

1. Go to https://railway.app
2. Click "Deploy from GitHub"
3. Select your repository
4. Select `backend` service
5. Add MongoDB service from Railway marketplace
6. Configure environment variables
7. Deploy

## Connecting Frontend to Backend

After deploying both:

1. **Get your backend URL**
   - Render: `https://your-api-name.onrender.com`
   - Heroku: `https://your-app-name.herokuapp.com`

2. **Update Netlify Environment Variables**
   - Go to your Netlify site settings
   - Build & Deploy → Environment
   - Set `REACT_APP_BACKEND_URL=https://your-backend-url.com`
   - Trigger a new deploy

3. **Update CORS in Backend**
   - Set `CORS_ORIGINS` environment variable to your Netlify domain
   - Example: `https://your-site-name.netlify.app`

## Testing the Deployment

1. **Frontend Health Check**
   - Visit your Netlify URL
   - Check browser console (F12) for any errors

2. **Backend Health Check**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Database Connection**
   - Visit: `https://your-backend-url.com/api/health/ready`
   - Should return: `{"ready":true}`

## Troubleshooting

### Frontend Issues
- **Blank page**: Check browser console (F12) for errors
- **API errors**: Ensure `REACT_APP_BACKEND_URL` is set correctly
- **CORS errors**: Update `CORS_ORIGINS` in backend environment

### Backend Issues
- **503 Service Unavailable**: Check MongoDB connection string
- **Port errors**: Ensure you're using environment variable `$PORT`
- **CORS errors**: Check `CORS_ORIGINS` matches your frontend URL

## Local Development

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn server:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm start
```

Visit: `http://localhost:3000`

## Environment Variables Summary

### Frontend (.env.production)
```
REACT_APP_BACKEND_URL=https://your-backend-api.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=true
```

### Backend
```
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=test_database
CORS_ORIGINS=https://your-site-name.netlify.app
```

## Next Steps

1. Deploy backend to Render/Heroku
2. Set up MongoDB Atlas
3. Deploy frontend to Netlify
4. Connect them via environment variables
5. Test the application
6. Set up custom domain (optional)

For more help:
- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
