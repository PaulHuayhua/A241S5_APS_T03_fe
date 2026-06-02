const ParcelaStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      {/* Área Total */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Área Total</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.areaTotal.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Hectáreas registradas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Parcelas Activas */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Parcelas Activas</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.parcelasActivas}
            </p>
            <p className="text-sm text-gray-500 mt-2">En producción</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* pH Promedio */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">pH Promedio</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.phPromedio ? stats.phPromedio.toFixed(1) : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Calidad del suelo</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Materia Orgánica */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Materia Orgánica</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.materiaOrganicaPromedio ? `${stats.materiaOrganicaPromedio.toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Promedio general</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParcelaStatsCards
