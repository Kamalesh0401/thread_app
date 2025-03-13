import api from '../utils/api';

export const getUserProfile = async (userId) => {
  return await api.get(`/users?id=${userId}`);
};

export const getUserThreads = async (userId, page = 1, limit = 10) => {
  return await api.get(`/users/${userId}/threads?page=${page}&limit=${limit}`);
};

export const getUserLikes = async (userId, page = 1, limit = 10) => {
  return await api.get(`/users/${userId}/likes?page=${page}&limit=${limit}`);
};