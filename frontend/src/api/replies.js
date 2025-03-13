import api from '../utils/api';

export const likeReply = async (replyId) => {
  return await api.post(`/replies/${replyId}/like`);
};

export const unlikeReply = async (replyId) => {
  return await api.post(`/replies/${replyId}/like`);
};

export const deleteReply = async (replyId) => {
  return await api.delete(`/replies/${replyId}`);
};

export const editReply = async (replyId, content) => {
  return await api.put(`/replies/${replyId}`, { content });
};