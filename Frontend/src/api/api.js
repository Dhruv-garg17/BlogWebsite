import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL:'https://blogwebsite-2u5t.onrender.com/api',
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
export const fetchAllPosts = (page = 1, status = '') => {
  const params = { page };
  if (status) params.status = status;
  return API.get('/admin/posts/all', { params });
};

export const approvePost = (id) => API.patch(`/posts/admin/posts/${id}/approve`);
export const rejectPost = (id) => API.delete(`/posts/admin/posts/${id}`);
export const bulkApprovePosts = (postIds) => API.post('/posts/admin/bulk-approve', { postIds });
export const bulkRejectPosts = (postIds) => API.post('/posts/admin/bulk-reject', { postIds });


// Error handling interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);