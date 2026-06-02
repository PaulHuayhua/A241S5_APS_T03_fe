import apiService from '../../../shared/services/api.service'
import { API_ENDPOINTS } from '../../../config/api'

const alertaService = {
  // Obtener todas las alertas
  getAll: async () => {
    return await apiService.get(API_ENDPOINTS.ALERTAS_CLIMATICAS)
  },

  // Obtener alerta por ID
  getById: async (id) => {
    return await apiService.get(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/${id}`)
  },

  // Obtener alertas activas por región
  getAlertasActivasByRegion: async (idRegion) => {
    return await apiService.get(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/region/${idRegion}/activas`)
  },

  // Crear nueva alerta
  create: async (alertaData) => {
    return await apiService.post(API_ENDPOINTS.ALERTAS_CLIMATICAS, alertaData)
  },

  // Actualizar alerta
  update: async (id, alertaData) => {
    return await apiService.put(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/${id}`, alertaData)
  },

  // Eliminar alerta
  delete: async (id) => {
    return await apiService.delete(`${API_ENDPOINTS.ALERTAS_CLIMATICAS}/${id}`)
  },

  // Desactivar alerta (cambiar activa a false)
  desactivar: async (id) => {
    const alerta = await alertaService.getById(id)
    alerta.activa = false
    return await alertaService.update(id, alerta)
  },

  // Activar alerta (cambiar activa a true)
  activar: async (id) => {
    const alerta = await alertaService.getById(id)
    alerta.activa = true
    return await alertaService.update(id, alerta)
  }
}

export default alertaService