import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const maintenanceApi = axios.create({
  baseURL: `${API_BASE_URL}/maintenances`,
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getMaintenanceRequests = async () => {
  const response = await maintenanceApi.get('/');
  return unwrap(response);
};

export const createMaintenanceRequest = async (payload) => {
  const response = await maintenanceApi.post('/', payload);
  return unwrap(response);
};

export const updateMaintenanceRequest = async (id, payload) => {
  const response = await maintenanceApi.put(`/${id}`, payload);
  return unwrap(response);
};

export const deleteMaintenanceRequest = async (id) => {
  const response = await maintenanceApi.delete(`/${id}`);
  return unwrap(response);
};
