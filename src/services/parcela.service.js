import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const parcelaService = {
  getAll: () => apiService.get(API_ENDPOINTS.PARCELAS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.PARCELAS}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.PARCELAS, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.PARCELAS}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.PARCELAS}/${id}`),
};
