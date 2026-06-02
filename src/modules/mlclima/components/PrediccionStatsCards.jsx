import { Brain, Target, BarChart3, TrendingUp } from 'lucide-react'

export default function PrediccionStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Precisión Promedio</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.precisionPromedio}%
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-gray-600">+3.2% vs. mes anterior</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
            <Brain className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Predicciones Activas</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.prediccionesActivas}
            </p>
            <p className="text-xs text-gray-600 mt-2">{stats.parcelasMonitoreadas} parcelas monitoreadas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
            <Target className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Modelos Activos</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.modelosActivos}
            </p>
            <p className="text-xs text-gray-600 mt-2">Random Forest, XGBoost, LSTM</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 group-hover:scale-110 transition-all duration-300">
            <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rendimiento Estimado</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.rendimientoEstimado}%
            </p>
            <p className="text-xs text-gray-600 mt-2">Eficiencia proyectada</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
