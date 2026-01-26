from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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


# Posts CRUD
@api_router.post("/posts", response_model=Post)
async def create_post(post_data: PostCreate):
    post = Post(**post_data.model_dump())
    doc = post.model_dump()
    await db.posts.insert_one(doc)
    return post

@api_router.get("/posts", response_model=List[Post])
async def get_posts(
    platform: Optional[Platform] = None,
    status: Optional[Status] = None,
    content_type: Optional[ContentType] = None,
    priority: Optional[Priority] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None
):
    query = {}
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
async def get_post(post_id: str):
    post = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: str, post_data: PostUpdate):
    existing = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_dict = {k: v for k, v in post_data.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.posts.update_one({"id": post_id}, {"$set": update_dict})
    updated = await db.posts.find_one({"id": post_id}, {"_id": 0})
    return updated

@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

# Batch status update for Kanban
@api_router.patch("/posts/{post_id}/status")
async def update_post_status(post_id: str, status: Status):
    result = await db.posts.update_one(
        {"id": post_id},
        {"$set": {"status": status.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Status updated"}

# Dashboard stats
@api_router.get("/stats")
async def get_stats():
    total = await db.posts.count_documents({})
    ideas = await db.posts.count_documents({"status": "idea"})
    in_progress = await db.posts.count_documents({"status": {"$in": ["scripted", "shooting", "editing", "review"]}})
    ready = await db.posts.count_documents({"status": "ready"})
    published = await db.posts.count_documents({"status": "published"})
    
    # Platform breakdown
    platform_stats = {}
    for platform in Platform:
        count = await db.posts.count_documents({"platform": platform.value})
        platform_stats[platform.value] = count
    
    # Status breakdown
    status_stats = {}
    for status in Status:
        count = await db.posts.count_documents({"status": status.value})
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
async def get_tags():
    pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags"}},
        {"$sort": {"_id": 1}}
    ]
    result = await db.posts.aggregate(pipeline).to_list(100)
    return [item["_id"] for item in result]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kcdotfxmanager.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
