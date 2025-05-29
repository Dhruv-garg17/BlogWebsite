import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const loginUser = (data) => API.post('/auth/login', data);

export const fetchPosts = (page = 1, topic = '') =>
  API.get(`/posts?page=${page}${topic ? `&topic=${topic}` : ''}`);

export const addPost = (data) => API.post('/posts', data);

export const fetchPendingPosts = (page = 1) => API.get(`/admin/posts/pending?page=${page}`);
export const approvePost = (id) => API.post(`/admin/posts/${id}/approve`);
export const rejectPost = (id) => API.delete(`/admin/posts/${id}/reject`);
