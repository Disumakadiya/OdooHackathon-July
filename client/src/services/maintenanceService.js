import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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

// Workflow Transitions
export const approveMaintenance = async (id, comment) => {
  const response = await maintenanceApi.patch(`/${id}/approve`, { comment });
  return unwrap(response);
};

export const rejectMaintenance = async (id, reason) => {
  const response = await maintenanceApi.patch(`/${id}/reject`, { reason });
  return unwrap(response);
};

export const assignTechnician = async (id, technicianId) => {
  const response = await maintenanceApi.patch(`/${id}/assign`, { technician_id: technicianId });
  return unwrap(response);
};

export const startMaintenance = async (id) => {
  const response = await maintenanceApi.patch(`/${id}/start`);
  return unwrap(response);
};

export const resolveMaintenance = async (id, resolutionNotes) => {
  const response = await maintenanceApi.patch(`/${id}/resolve`, { resolution_notes: resolutionNotes });
  return unwrap(response);
};
