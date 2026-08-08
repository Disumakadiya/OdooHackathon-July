import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const notificationApi = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getNotifications = async () => {
  const response = await notificationApi.get('/');
  return unwrap(response);
};

export const markNotificationAsRead = async (id) => {
  const response = await notificationApi.patch(`/${id}/read`);
  return unwrap(response);
};

export const deleteNotification = async (id) => {
  const response = await notificationApi.delete(`/${id}`);
  return unwrap(response);
};
