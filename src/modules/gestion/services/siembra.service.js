import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const siembraService = {
  getAll: () => apiService.get(API_ENDPOINTS.SIEMBRAS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.SIEMBRAS}/${id}`),
  create: (data) => apiService.post(API_ENDPOINTS.SIEMBRAS, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.SIEMBRAS}/${id}`, data),
  updateEstado: (id, estado) => apiService.patch(`${API_ENDPOINTS.SIEMBRAS}/${id}/estado`, { estado }),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.SIEMBRAS}/${id}`),
}
