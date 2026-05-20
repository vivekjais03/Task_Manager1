import axios from 'axios';

const apiBaseURL = process.env.REACT_APP_API_URL || 'https://taskmanager-production-7c88.up.railway.app/api';
const api = axios.create({ baseURL: apiBaseURL });


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && !url.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
