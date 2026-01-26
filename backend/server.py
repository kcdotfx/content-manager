from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'content_manage')

logger.info(f"Environment: MONGO_URL is {'set' if mongo_url else 'NOT SET'}")
logger.info(f"Environment: DB_NAME = {db_name}")

if not mongo_url:
    raise ValueError(
        "MONGO_URL environment variable is not set. "
        "Please set it in your .env file or in your deployment platform (e.g., Render dashboard)."
    )

logger.info("Attempting MongoDB connection...")
try:
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
    db = client[db_name]
    logger.info("MongoDB client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MongoDB client: {e}")
    raise

# Create the main app without a prefix
app = FastAPI()

# Add CORS middleware BEFORE router is included - critical for proper middleware order
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kcdotfxmanager.netlify.app",
        "https://content-manager-881h.onrender.com",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:8000",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper functions for authentication
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hash: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hash.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Enums
class Platform(str, Enum):
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"

class ContentType(str, Enum):
    REEL = "reel"
    CAROUSEL = "carousel"
    STATIC = "static"
    VIDEO = "video"
    THREAD = "thread"
    SHORT = "short"

class Status(str, Enum):
    IDEA = "idea"
    SCRIPTED = "scripted"
    SHOOTING = "shooting"
    EDITING = "editing"
    REVIEW = "review"
    READY = "ready"
    PUBLISHED = "published"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

# User Models
class UserRegister(BaseModel):
    email: str
    password: str
    username: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    password_hash: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: str

# Models
class PostBase(BaseModel):
    title: str
    description: Optional[str] = ""
    platform: Platform
    content_type: ContentType
    status: Status = Status.IDEA
    priority: Priority = Priority.MEDIUM
    tags: List[str] = []
    hook: Optional[str] = ""
    script: Optional[str] = ""
    cta: Optional[str] = ""
    caption: Optional[str] = ""
    hashtags: List[str] = []
    scheduled_at: Optional[str] = None
    published_at: Optional[str] = None
    thumbnail_done: bool = False
    captions_finalized: bool = False
    hashtags_added: bool = False
    exported: bool = False
    uploaded: bool = False
    script_final: bool = False
    user_id: str  # Add user ownership

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    platform: Optional[Platform] = None
    content_type: Optional[ContentType] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    tags: Optional[List[str]] = None
    hook: Optional[str] = None
    script: Optional[str] = None
    cta: Optional[str] = None
    caption: Optional[str] = None
    hashtags: Optional[List[str]] = None
    scheduled_at: Optional[str] = None
    published_at: Optional[str] = None
    thumbnail_done: Optional[bool] = None
    captions_finalized: Optional[bool] = None
    hashtags_added: Optional[bool] = None
    exported: Optional[bool] = None
    uploaded: Optional[bool] = None
    script_final: Optional[bool] = None

class Post(PostBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Routes
@api_router.get("/")
async def root():
    return {"message": "Content Management API"}

# Simple health endpoints for readiness/liveness checks
@api_router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@api_router.get("/health/ready")
async def health_ready():
    try:
        # ping the MongoDB server to ensure readiness
        await client.admin.command('ping')
        return {"ready": True}
    except Exception:
        raise HTTPException(status_code=503, detail="Database not reachable")

@api_router.get("/health/live")
async def health_live():
    return {"alive": True, "timestamp": datetime.now(timezone.utc).isoformat()}


# Authentication Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username is taken
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Hash the password
    password_hash = hash_password(user_data.password)
    
    # Create new user
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "username": user_data.username,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user_id,
            "email": user_data.email,
            "username": user_data.username
        }
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    # Find user by email
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user["id"],
            "email": user["email"],
            "username": user["username"]
        }
    )

@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout endpoint - client should delete the token"""
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# Posts CRUD
@api_router.post("/posts", response_model=Post)
async def create_post(post_data: PostCreate, current_user: dict = Depends(get_current_user)):
    post = Post(**post_data.model_dump())
    doc = post.model_dump()
    await db.posts.insert_one(doc)
    return post

@api_router.get("/posts", response_model=List[Post])
async def get_posts(
    current_user: dict = Depends(get_current_user),
    platform: Optional[Platform] = None,
    status: Optional[Status] = None,
    content_type: Optional[ContentType] = None,
    priority: Optional[Priority] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None
):
    query = {"user_id": current_user["id"]}
    if platform:
        query["platform"] = platform.value
    if status:
        query["status"] = status.value
    if content_type:
        query["content_type"] = content_type.value
    if priority:
        query["priority"] = priority.value
    if tag:
        query["tags"] = {"$in": [tag]}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    posts = await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return posts

@api_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str, current_user: dict = Depends(get_current_user)):
    post = await db.posts.find_one({"id": post_id, "user_id": current_user["id"]}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: str, post_data: PostUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.posts.find_one({"id": post_id, "user_id": current_user["id"]}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_dict = {k: v for k, v in post_data.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.posts.update_one({"id": post_id}, {"$set": update_dict})
    updated = await db.posts.find_one({"id": post_id}, {"_id": 0})
    return updated

@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.posts.delete_one({"id": post_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

# Batch status update for Kanban
@api_router.patch("/posts/{post_id}/status")
async def update_post_status(post_id: str, status: Status, current_user: dict = Depends(get_current_user)):
    result = await db.posts.update_one(
        {"id": post_id, "user_id": current_user["id"]},
        {"$set": {"status": status.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Status updated"}

# Dashboard stats
@api_router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    query = {"user_id": current_user["id"]}
    total = await db.posts.count_documents(query)
    ideas = await db.posts.count_documents({**query, "status": "idea"})
    in_progress = await db.posts.count_documents({**query, "status": {"$in": ["scripted", "shooting", "editing", "review"]}})
    ready = await db.posts.count_documents({**query, "status": "ready"})
    published = await db.posts.count_documents({**query, "status": "published"})
    
    # Platform breakdown
    platform_stats = {}
    for platform in Platform:
        count = await db.posts.count_documents({**query, "platform": platform.value})
        platform_stats[platform.value] = count
    
    # Status breakdown
    status_stats = {}
    for status in Status:
        count = await db.posts.count_documents({**query, "status": status.value})
        status_stats[status.value] = count
    
    return {
        "total": total,
        "ideas": ideas,
        "in_progress": in_progress,
        "ready": ready,
        "published": published,
        "by_platform": platform_stats,
        "by_status": status_stats
    }

# Get all unique tags
@api_router.get("/tags")
async def get_tags(current_user: dict = Depends(get_current_user)):
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags"}},
        {"$sort": {"_id": 1}}
    ]
    result = await db.posts.aggregate(pipeline).to_list(100)
    return [item["_id"] for item in result]

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
