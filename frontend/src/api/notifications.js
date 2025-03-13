import api from '../utils/api';

export const getNotifications = async () => {
  return await api.get('/notifications');
};

export const markNotificationsAsRead = async (notificationIds) => {
  return await api.post('/notifications/read', { notificationIds });
};

export const markAllAsRead = async (notificationIds) => {
  return await api.post('/notifications/read', { notificationIds });
};