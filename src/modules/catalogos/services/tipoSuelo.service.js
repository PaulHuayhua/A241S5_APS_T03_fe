import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const tipoSueloService = {
  getAll: () => apiService.get(API_ENDPOINTS.TIPOS_SUELO),
  getById: (id) => apiService.get(`${API_ENDPOINTS.TIPOS_SUELO}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.TIPOS_SUELO, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.TIPOS_SUELO}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.TIPOS_SUELO}/${id}`),
}
