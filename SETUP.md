# Setup Instructions - Local Development

## Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB (Local or MongoDB Atlas)

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start Backend

```bash
cd backend
python -m uvicorn server:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test the backend:**
```bash
curl http://localhost:8000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 3. Start Frontend

```bash
cd frontend
npm start
```

The app should open automatically at http://localhost:3000

## Required for Full Functionality: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (M0 free tier)
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
   DB_NAME=test_database
   ```
6. Restart backend

### Option B: MongoDB Local

1. Install MongoDB Community Edition:
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. Verify it's running:
   ```bash
   mongosh
   # You should get a MongoDB shell
   ```

3. Update `backend/.env`:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=test_database
   ```

## Environment Files

### Frontend - .env.development
Used automatically when running `npm start`:
```
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=3000
ENABLE_HEALTH_CHECK=false
```

### Frontend - .env.production
Used when building for deployment:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=true
```

### Backend - .env
Create this file in `backend/` directory:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
```

## Development Tools

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:8000/api/health

# Create a post
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Content",
    "description":"Test post",
    "platform":"instagram",
    "content_type":"reel",
    "status":"idea"
  }'

# Get all posts
curl http://localhost:8000/api/posts

# Get tags
curl http://localhost:8000/api/tags
```

### Hot Reload Development

Both frontend and backend support hot reload:

**Frontend**: Changes in `src/` automatically refresh (fast refresh)
**Backend**: Changes in `server.py` automatically reload server (with --reload)

## Troubleshooting

### Backend Won't Start
- Check if port 8000 is already in use: `lsof -i :8000`
- Kill process: `kill -9 <PID>`
- Check Python version: `python --version` (need 3.9+)

### Frontend Won't Start
- Check if port 3000 is in use: `lsof -i :3000`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (need 18+)

### Can't Connect to MongoDB
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: Whitelist your IP in cluster settings
- Check credentials are correct

### API Returns 500 Error
- Check backend console for error messages
- Verify MongoDB connection
- Ensure `.env` file has correct MONGO_URL

## Next Steps

1. ✅ Complete the setup above
2. ✅ Set up MongoDB
3. ✅ Run frontend and backend
4. ✅ Test the app at http://localhost:3000
5. ✅ When ready, follow [GET_STARTED.md](./GET_STARTED.md) for deployment

## Production Deployment

When ready to deploy:
- See [GET_STARTED.md](./GET_STARTED.md) for quick 3-step deployment
- See [DEPLOY.md](./DEPLOY.md) for detailed deployment guide
- See [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) for full reference
