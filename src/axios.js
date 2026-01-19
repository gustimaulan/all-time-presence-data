import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : (import.meta.env.VITE_API_BASE_URL || '/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
