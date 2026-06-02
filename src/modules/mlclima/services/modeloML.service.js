import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const modeloMLService = {
  getAll: () => apiService.get(API_ENDPOINTS.MODELOS_ML),
  getById: (id) => apiService.get(`${API_ENDPOINTS.MODELOS_ML}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.MODELOS_ML, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.MODELOS_ML}/${id}`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.MODELOS_ML}/${id}`),
}
