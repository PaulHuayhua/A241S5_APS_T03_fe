import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import {
  DashboardStatsCards,
  ClimaWidget,
  PrecipitacionChart,
  SiembrasRecientes,
  AlertasClimaticas
} from '../components'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { loading, stats, precipitacionData, climaActual } = useDashboard()

  const handleCardClick = (route) => {
    navigate(route)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-2">Resumen general de operaciones agrícolas</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards stats={stats} onCardClick={handleCardClick} />

      {/* Main Content Grid: Clima y Precipitaciones */}
      <div className="grid grid-cols-12 gap-5">
        <ClimaWidget climaActual={climaActual} />
        <PrecipitacionChart data={precipitacionData} />
      </div>

      {/* Siembras Recientes y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiembrasRecientes 
          siembras={stats.siembrasRecientes} 
          onVerTodas={() => handleCardClick('/gestion/siembras')}
        />
        <AlertasClimaticas 
          alertas={stats.alertasClimaticas} 
          onVerTodas={() => handleCardClick('/alertas')}
        />
      </div>
    </div>
  )
}
