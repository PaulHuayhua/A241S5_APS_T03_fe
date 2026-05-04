import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const cultivoService = {
  getAll: () => apiService.get(`${API_ENDPOINTS.CULTIVOS}?includeInactive=true`),
  getById: (id) => apiService.get(`${API_ENDPOINTS.CULTIVOS}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.CULTIVOS, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.CULTIVOS}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.CULTIVOS}/${id}`),
};

export const variedadService = {
  getAll: () => apiService.get(`${API_ENDPOINTS.VARIEDADES}?includeInactive=true`),
  getById: (id) => apiService.get(`${API_ENDPOINTS.VARIEDADES}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.VARIEDADES, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.VARIEDADES}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.VARIEDADES}/${id}`),
};
