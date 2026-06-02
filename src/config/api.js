export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '',
  TIMEOUT: 30000,
}

export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_STATS: '/dashboard/estadisticas',
  
  // Catálogos
  CULTIVOS: '/cultivos',
  VARIEDADES: '/variedades',
  TIPOS_SUELO: '/tipos-suelo',
  
  // Gestión
  PARCELAS: '/parcelas',
  SIEMBRAS: '/siembras',
  COSECHAS: '/cosechas',
  
  // ML y Clima
  DATOS_CLIMATICOS: '/datos-climaticos',
  PREDICCIONES: '/predicciones',
  MODELOS_ML: '/modelos-ml',
  
  // Finanzas
  COSTOS_CAMPANA: '/costos-campana',
  ALERTAS_CLIMATICAS: '/alertas-climaticas',
  
  // Geografía
  DEPARTAMENTOS: '/departamentos',
  REGIONES: '/regiones',
  
  // GROQ AI
  GROQ_CULTIVO: '/groq/cultivo/autocompletar',
  GROQ_VARIEDAD: '/groq/variedad/autocompletar',
  GROQ_SUGERIR: '/groq/variedades/sugerir',
}
