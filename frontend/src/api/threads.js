import api from '../utils/api';


export const createThread = async (threadData) => {
  return await api.post('/threads', threadData);
};

export const getThreads = async (page = 1, limit = 10) => {
  return await api.get(`/threads?page=${page}&limit=${limit}`);
};

export const getPopularThreads = async (page = 1, limit = 10) => {
  return await api.get(`/threads/popular?page=${page}&limit=${limit}`);
};

export const getThreadById = async (threadId) => {
  return await api.get(`/threads/${threadId}`);
};

export const deleteThread = async (threadId) => {
  return await api.delete(`/threads/${threadId}`);
};

export const likeThread = async (threadId) => {
  return await api.post(`/threads/${threadId}/like`);
};

export const getThreadReplies = async (threadId, page = 1, limit = 20) => {
  return await api.get(`/threads/${threadId}/replies?page=${page}&limit=${limit}`);
};

export const addReplyToThread = async (threadId, replyData) => {
  return await api.post(`/threads/${threadId}/replies`, replyData);
};