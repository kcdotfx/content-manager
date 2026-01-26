# 📱 Content Planner App

A modern, full-stack content planning and management application. Built with React, FastAPI, and MongoDB.

## ✨ Features

- 📝 **Content Management**: Create, edit, and organize content posts
- 🎯 **Kanban Board**: Visual workflow management with drag-and-drop
- 📅 **Calendar View**: Schedule and visualize content timeline
- 🏷️ **Smart Tagging**: Organize and filter by custom tags
- 📊 **Dashboard**: Real-time analytics and statistics
- 🔍 **Search & Filter**: Powerful content discovery
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS + Shadcn/UI
- 📱 **Responsive**: Works great on desktop and tablet

## 🚀 Quick Start

### Local Development (3 commands)

```bash
# Terminal 1: Backend
cd backend && python -m uvicorn server:app --reload

# Terminal 2: Frontend  
cd frontend && npm start

# Open http://localhost:3000
```

See [SETUP.md](./SETUP.md) for detailed local setup.

## 📦 Deployment

### Deploy Online Now! (2 minutes setup)

Follow our [GET_STARTED.md](./GET_STARTED.md) for:
- **Backend**: Deploy to Render (free tier available)
- **Frontend**: Deploy to Netlify (free)
- **Database**: Use MongoDB Atlas (free)

### What's Ready for Deployment

✅ Netlify configuration (`frontend/netlify.toml`)  
✅ Render/Heroku support (`backend/Procfile`, `backend/vercel.json`)  
✅ Environment configuration (development & production)  
✅ CORS properly configured  
✅ Production build optimized (187 KB)  
✅ All dependencies installed  
✅ Tested and working  

**Get started**: [GET_STARTED.md](./GET_STARTED.md)  
**Detailed guide**: [DEPLOY.md](./DEPLOY.md)  
**Full reference**: [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)  

## 🏗️ Project Structure

```
Content Planner App/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── pages/              # Route pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Ideas.jsx
│   │   │   ├── Kanban.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── PostDetail.jsx
│   │   ├── components/         # React components
│   │   │   ├── CreatePostDialog.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ui/            # Shadcn/ui components
│   │   ├── lib/               # Utilities
│   │   │   ├── api.js         # API client
│   │   │   └── utils.js       # Helpers
│   │   ├── hooks/             # Custom hooks
│   │   └── App.js             # Main app
│   ├── netlify.toml           # Netlify deployment config
│   ├── .env.development       # Dev environment
│   ├── .env.production        # Production environment
│   └── package.json
│
├── backend/                    # FastAPI server
│   ├── server.py              # Main application
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile               # Heroku deployment
│   ├── vercel.json            # Vercel deployment
│   └── .env                   # Backend environment
│
├── SETUP.md                   # Local development guide
├── GET_STARTED.md             # Quick deployment (3 steps)
├── DEPLOY.md                  # Detailed deployment guide
├── DEPLOYMENT_READY.md        # Full reference & status
└── docker-compose.yml         # Docker local setup
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Recharts** - Charts & analytics
- **Hello Pangea DND** - Drag & drop (Kanban)
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Python 3.11** - Runtime

### Database
- **MongoDB** - Document database
- **MongoDB Atlas** - Cloud hosting (recommended)

## 🌐 API Endpoints

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/{id}` - Get post details
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `PATCH /api/posts/{id}/status` - Update status

### Stats & Tags
- `GET /api/stats` - Dashboard statistics
- `GET /api/tags` - Get all tags
- `GET /api/health` - Health check
- `GET /api/health/ready` - Database readiness

## 📋 Query Filters

Posts can be filtered by:
- `platform` - instagram, youtube, linkedin, twitter
- `status` - idea, scripted, shooting, editing, review, ready, published
- `content_type` - reel, carousel, static, video, thread, short
- `priority` - low, medium, high
- `search` - Full-text search
- `tag` - Filter by tags

Example:
```
GET /api/posts?platform=instagram&status=ready&priority=high
```

## 🚀 Deployment Platforms Supported

### Frontend
- ✅ Netlify (recommended)
- ✅ Vercel
- ✅ GitHub Pages
- ✅ Any static host (S3, CloudFlare, etc.)

### Backend
- ✅ Render (recommended)
- ✅ Heroku
- ✅ Railway
- ✅ Digital Ocean
- ✅ AWS/Azure/GCP

### Database
- ✅ MongoDB Atlas (recommended)
- ✅ Self-hosted MongoDB

## 🔧 Environment Variables

### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=https://your-backend-api.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=true
```

### Backend
```env
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=test_database
CORS_ORIGINS=https://your-frontend-url.com
```

## 📊 Local Development Status

- ✅ Frontend: Running on http://localhost:3000
- ✅ Backend: Running on http://localhost:8000
- ✅ API Health: http://localhost:8000/api/health
- ✅ Build: Production build successful (187 KB)
- ✅ All dependencies: Installed ✓

## 🎯 Next Steps

### Just Getting Started?
1. Read [SETUP.md](./SETUP.md) - Local development setup
2. Run locally and explore
3. Check out the features

### Ready to Deploy?
1. Follow [GET_STARTED.md](./GET_STARTED.md) - 3-step deployment
2. Takes about 5-10 minutes
3. Your app will be live!

### Need More Details?
- [DEPLOY.md](./DEPLOY.md) - Comprehensive deployment guide
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Full reference

## 🐛 Troubleshooting

### Local Development
- See [SETUP.md](./SETUP.md) troubleshooting section

### Deployment Issues
- See [DEPLOY.md](./DEPLOY.md) troubleshooting section
- See [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) troubleshooting section

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💡 Features Roadmap

- [ ] User authentication & authorization
- [ ] Multi-user collaboration
- [ ] AI-powered content suggestions
- [ ] Social media integration
- [ ] Content scheduling automation
- [ ] Analytics dashboard expansion
- [ ] Mobile app (React Native)
- [ ] Export to CSV/PDF
- [ ] Email notifications

---

**Status**: ✅ Ready for Production  
**Last Updated**: January 25, 2026  
**Version**: 0.1.0  

**Get started in 3 minutes**: [GET_STARTED.md](./GET_STARTED.md)
