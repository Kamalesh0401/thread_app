import axios from 'axios';
import { getToken } from './tokenManager';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentUserIdStore = null;

export const setApiUserId = (userId) => {
  currentUserIdStore = userId;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken(currentUserIdStore);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      sessionStorage.removeItem(currentUserIdStore);
    }
    return Promise.reject(error);
  }
);

export default api;