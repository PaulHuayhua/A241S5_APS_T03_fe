import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const climaService = {
  getAll: () => apiService.get(API_ENDPOINTS.DATOS_CLIMATICOS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.DATOS_CLIMATICOS}/${id}`),
  getByRegionAndDateRange: (regionId, fechaInicio, fechaFin) => 
    apiService.get(`${API_ENDPOINTS.DATOS_CLIMATICOS}/region/${regionId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
  getByDateRange: (startDate, endDate) => 
    apiService.get(`${API_ENDPOINTS.DATOS_CLIMATICOS}?fechaInicio=${startDate}&fechaFin=${endDate}`),
}
