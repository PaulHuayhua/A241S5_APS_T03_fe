import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const climaService = {
  getAll: () => apiService.get(API_ENDPOINTS.DATOS_CLIMATICOS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.DATOS_CLIMATICOS}/${id}`),
  getByParcela: (idParcela) => apiService.get(`${API_ENDPOINTS.DATOS_CLIMATICOS}/parcela/${idParcela}`),
};

export const alertaService = {
  getAll: () => apiService.get(API_ENDPOINTS.ALERTAS_CLIMATICAS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/${id}`),
  getActivas: () => apiService.get(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/activas`),
};
