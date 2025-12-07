import axios from 'axios';

const API_BASE_URL = 'https://story-app-backend-3f4s.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses by clearing invalid token and reloading
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload(); // Reload to show login screen
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    return response.data;
  },
};

// Stories API calls
export const storiesAPI = {
  createStory: async (storyData) => {
    const response = await api.post('/stories/', storyData);
    return response.data;
  },

  getStories: async () => {
    const response = await api.get('/stories/');
    return response.data;
  },

  getStory: async (storyId) => {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  },

  updateStory: async (storyId, storyData) => {
    const response = await api.put(`/stories/${storyId}`, storyData);
    return response.data;
  },

  deleteStory: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },

  // Comment API calls
  createComment: async (storyId, commentData) => {
    const response = await api.post(`/stories/${storyId}/comments`, commentData);
    return response.data;
  },

  getComments: async (storyId) => {
    const response = await api.get(`/stories/${storyId}/comments`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/stories/comments/${commentId}`);
    return response.data;
  },

  // Like API calls
  likeStory: async (storyId) => {
    const response = await api.post(`/stories/${storyId}/like`);
    return response.data;
  },

  unlikeStory: async (storyId) => {
    const response = await api.delete(`/stories/${storyId}/like`);
    return response.data;
  },

  checkLikeStatus: async (storyId) => {
    const response = await api.get(`/stories/${storyId}/like`);
    return response.data;
  },
};

export default api;
