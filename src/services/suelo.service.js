import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const sueloService = {
  getAll: () => apiService.get(API_ENDPOINTS.TIPOS_SUELO),
  getById: (id) => apiService.get(`${API_ENDPOINTS.TIPOS_SUELO}/${id}`),
};
