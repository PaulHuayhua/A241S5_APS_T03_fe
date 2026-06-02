import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

export const eficienciaService = {
  // Calcular métricas de eficiencia desde cosechas y predicciones
  calcularMetricas: async () => {
    try {
      const [cosechas, predicciones] = await Promise.all([
        apiService.get(API_ENDPOINTS.COSECHAS),
        apiService.get(API_ENDPOINTS.PREDICCIONES)
      ])
      
      return { cosechas, predicciones }
    } catch (error) {
      console.error('Error al calcular métricas:', error)
      throw error
    }
  },
  
  // Obtener estadísticas del dashboard (incluye métricas generales)
  getEstadisticas: () => apiService.get(API_ENDPOINTS.DASHBOARD_STATS),
}
