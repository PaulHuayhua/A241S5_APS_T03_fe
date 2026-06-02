import { TrendingUp, DollarSign, Droplets, Target, BarChart3 } from 'lucide-react'

export default function EficienciaStatsCards({ metricas }) {
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(valor)
  }

  return (
    <div className="grid grid-cols-4 gap-5">
      {/* ROI */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ROI Promedio</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {metricas.economica.roi}%
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-gray-600">+8.2% vs. período anterior</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
            <DollarSign className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Eficiencia Productiva */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Eficiencia Productiva</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {metricas.productiva.eficiencia}%
            </p>
            <p className="text-xs text-gray-600 mt-2">Precisión ML: {metricas.productiva.precision}%</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
            <Target className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Eficiencia de Riego */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Eficiencia de Riego</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {metricas.riego.eficienciaPromedio}%
            </p>
            <p className="text-xs text-gray-600 mt-2">Ahorro: {metricas.riego.ahorroVsTradicional}% vs tradicional</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-50 group-hover:scale-110 transition-all duration-300">
            <Droplets className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Margen Neto */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Margen Neto</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {metricas.economica.margenNeto}%
            </p>
            <p className="text-xs text-gray-600 mt-2">Costo/ha: {formatearMoneda(metricas.economica.costoProduccion)}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 group-hover:scale-110 transition-all duration-300">
            <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
