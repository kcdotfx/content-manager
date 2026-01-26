import axios from 'axios';

// Allow deploying frontend on the same domain as the backend (relative /api)
// or explicitly configuring a remote backend via REACT_APP_BACKEND_URL.
const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = API_URL ? `${API_URL}/api` : '/api';

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts
export const getPosts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.platform) params.append('platform', filters.platform);
  if (filters.status) params.append('status', filters.status);
  if (filters.content_type) params.append('content_type', filters.content_type);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);
  if (filters.tag) params.append('tag', filters.tag);

  try {
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    // If the API root returns 404 (e.g., missing backend), return an empty array
    // so pages can render cleanly during dev; re-throw other errors so callers
    // can surface appropriate messages.
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getPost = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const updatePostStatus = async (id, status) => {
  const response = await api.patch(`/posts/${id}/status?status=${status}`);
  return response.data;
};

// Stats
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Tags
export const getTags = async () => {
  const response = await api.get('/tags');
  return response.data;
};

export default api;
