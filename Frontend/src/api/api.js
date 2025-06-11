import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request interceptor for adding auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Posts endpoints
export const fetchPosts = (page = 1, topic = '', searchQuery = '') => {
  const params = {
    page,
    ...(topic && { topic }),
    ...(searchQuery && { search: searchQuery })
  };
  return API.get('/posts', { params });
};

export const addPost = (data) => API.post('/posts', data);

// Admin endpoints
export const fetchPendingPosts = (page = 1) => API.get('/admin/posts/pending', { params: { page } });
export const approvePost = (id) => API.post(`/admin/posts/${id}/approve`);
export const rejectPost = (id) => API.delete(`/admin/posts/${id}/reject`);