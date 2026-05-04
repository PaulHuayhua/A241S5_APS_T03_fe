// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/estadisticas',
  
  // Usuarios
  USUARIOS: '/usuarios',
  
  // Roles
  ROLES: '/roles',
  
  // Departamentos y Regiones
  DEPARTAMENTOS: '/departamentos',
  REGIONES: '/regiones',
  
  // Cultivos y Variedades
  CULTIVOS: '/cultivos',
  VARIEDADES: '/variedades',
  
  // Tipos de Suelo
  TIPOS_SUELO: '/tipos-suelo',
  
  // Parcelas
  PARCELAS: '/parcelas',
  
  // Siembras
  SIEMBRAS: '/siembras',
  
  // Cosechas
  COSECHAS: '/cosechas',
  
  // Datos Climáticos
  DATOS_CLIMATICOS: '/datos-climaticos',
  
  // Alertas Climáticas
  ALERTAS_CLIMATICAS: '/alertas-climaticas',
  
  // Predicciones
  PREDICCIONES: '/predicciones',
  
  // Modelos ML
  MODELOS_ML: '/modelos-ml',
  
  // Costos de Campaña
  COSTOS_CAMPANA: '/costos-campana',
  
  // Auditoría
  AUDITORIA: '/auditoria'
};

export default API_BASE_URL;
