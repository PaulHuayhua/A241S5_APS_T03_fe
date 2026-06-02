import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

const dashboardService = {
  getEstadisticas: async () => {
    return await apiService.get(`${API_ENDPOINTS.DASHBOARD_STATS}`)
  }
}

export default dashboardService
