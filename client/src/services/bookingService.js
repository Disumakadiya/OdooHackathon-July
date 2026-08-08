import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const bookingApi = axios.create({
  baseURL: `${API_BASE_URL}/bookings`,
  headers: { 'Content-Type': 'application/json' },
});

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getBookings = async () => {
  const response = await bookingApi.get('/');
  return unwrap(response);
};

export const createBooking = async (payload) => {
  const response = await bookingApi.post('/', payload);
  return unwrap(response);
};

export const updateBooking = async (id, payload) => {
  const response = await bookingApi.put(`/${id}`, payload);
  return unwrap(response);
};

export const deleteBooking = async (id) => {
  const response = await bookingApi.delete(`/${id}`);
  return unwrap(response);
};
