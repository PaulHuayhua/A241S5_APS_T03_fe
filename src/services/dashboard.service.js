import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

export const dashboardService = {
  getEstadisticas: () => apiService.get(API_ENDPOINTS.DASHBOARD_STATS),
};
