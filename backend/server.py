# Updated Backend/server.py

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional

app = FastAPI()

# Database simulation
users_db = {}

# Guest login request model
class GuestLogin(BaseModel):
    username: str = 'guest'

# Token expiry time
GUEST_SESSION_EXPIRY = timedelta(hours=4)

@app.post('/api/auth/guest-login')
def guest_login(guest: GuestLogin):
    guest_id = len(users_db) + 1  # Simulate user ID
    expiry = datetime.utcnow() + GUEST_SESSION_EXPIRY
    users_db[guest_id] = {'is_guest': True, 'expiry': expiry}
    return {'guest_id': guest_id, 'expires_at': expiry}

def get_current_user(guest_id: Optional[int] = None):
    user = users_db.get(guest_id)
    if user:
        if user['is_guest'] and user['expiry'] < datetime.utcnow():
            raise HTTPException(status_code=401, detail='Guest session expired')
        return user
    raise HTTPException(status_code=404, detail='User not found')


# Dependency for non-guest users only
async def get_non_guest_user(guest_id: int = Depends(get_current_user)):
    if guest_id and users_db[guest_id]['is_guest']:
        raise HTTPException(status_code=403, detail='Operation not permitted for guest users')

@app.post('/api/posts')
def create_post(post: dict, guest_id: int = Depends(get_non_guest_user)):
    return {'post_id': 1, 'content': post}

@app.put('/api/posts/{post_id}')
def update_post(post_id: int, post: dict, guest_id: int = Depends(get_non_guest_user)):
    return {'post_id': post_id, 'updated_content': post}

@app.delete('/api/posts/{post_id}')
def delete_post(post_id: int, guest_id: int = Depends(get_non_guest_user)):
    return {'post_id': post_id, 'status': 'deleted'}

@app.patch('/api/posts/{post_id}/status')
def update_post_status(post_id: int, status: str, guest_id: int = Depends(get_non_guest_user)):
    return {'post_id': post_id, 'status': status}
