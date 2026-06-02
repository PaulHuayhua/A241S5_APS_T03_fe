import apiService from './api.service'
import { API_ENDPOINTS } from '../../config/api'

export const departamentoService = {
  getAll: () => apiService.get(API_ENDPOINTS.DEPARTAMENTOS),
  getById: (id) => apiService.get(`${API_ENDPOINTS.DEPARTAMENTOS}/${id}`),
}

export const regionService = {
  getAll: () => apiService.get(API_ENDPOINTS.REGIONES),
  getById: (id) => apiService.get(`${API_ENDPOINTS.REGIONES}/${id}`),
  getByDepartamento: (idDepartamento) => apiService.get(`${API_ENDPOINTS.REGIONES}/departamento/${idDepartamento}`),
}

// Servicio consolidado de geografía
const geografiaService = {
  getDepartamentos: () => departamentoService.getAll(),
  getDepartamentoById: (id) => departamentoService.getById(id),
  getRegiones: () => regionService.getAll(),
  getRegionById: (id) => regionService.getById(id),
  getRegionesByDepartamento: (idDepartamento) => regionService.getByDepartamento(idDepartamento),
}

export default geografiaService
