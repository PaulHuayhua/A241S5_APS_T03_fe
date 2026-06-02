import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const prediccionService = {
  getAll: () => apiService.get(API_ENDPOINTS.PREDICCIONES),
  getById: (id) => apiService.get(`${API_ENDPOINTS.PREDICCIONES}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.PREDICCIONES, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.PREDICCIONES}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.PREDICCIONES}/${id}`),
}
