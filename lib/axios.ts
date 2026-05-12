import axios from 'axios';

<<<<<<< HEAD
const api = axios.create({
=======
const axiosInstance = axios.create({
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

<<<<<<< HEAD
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Tự động redirect về login khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
=======
export default axiosInstance;
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
