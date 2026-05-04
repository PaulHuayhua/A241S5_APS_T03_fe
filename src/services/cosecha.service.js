import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const cosechaService = {
  getAll: () => apiService.get(API_ENDPOINTS.COSECHAS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.COSECHAS}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.COSECHAS, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.COSECHAS}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.COSECHAS}/${id}`),
};
