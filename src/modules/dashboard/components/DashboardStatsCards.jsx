import { TrendingUp, Sprout, AlertTriangle } from 'lucide-react'

export default function DashboardStatsCards({ stats, onCardClick }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Rendimiento Promedio */}
      <div 
        onClick={() => onCardClick('/mlclima/predicciones')}
        className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rendimiento Promedio</p>
            <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">
              {stats.rendimientoPromedio} <span className="text-lg text-gray-600">ton/ha</span>
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-gray-600">+4.2% vs. Ciclo anterior</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Campañas Activas */}
      <div 
        onClick={() => onCardClick('/gestion/parcelas')}
        className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Campañas Activas</p>
            <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">
              {String(stats.campanasActivas).padStart(2, '0')}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <Sprout className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-gray-600">Siembras en curso</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
            <Sprout className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Alertas Tempranas */}
      <div 
        onClick={() => onCardClick('/alertas')}
        className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alertas Tempranas</p>
            <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">
              {String(stats.alertasTempranas).padStart(2, '0')}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <AlertTriangle className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-gray-600">Prioridad Media / Alta</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
            <AlertTriangle className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
