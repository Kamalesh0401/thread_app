import api from '../utils/api';

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const getCurrentUser = async (id) => {
  return await api.get(`/users/${id}`);
};

export const updateUserProfile = async (userData) => {
  return await api.put(`/users`, userData);
};