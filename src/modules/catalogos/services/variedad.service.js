import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const variedadService = {
  getAll: () => apiService.get(`${API_ENDPOINTS.VARIEDADES}?includeInactive=true`),
  getById: (id) => apiService.get(`${API_ENDPOINTS.VARIEDADES}/${id}`),
  getByCultivoId: (cultivoId) => apiService.get(`${API_ENDPOINTS.VARIEDADES}?cultivo=${cultivoId}`),
  create: (data) => apiService.post(API_ENDPOINTS.VARIEDADES, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.VARIEDADES}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.VARIEDADES}/${id}`),
}
