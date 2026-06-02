const SiembraStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      {/* Total Siembras */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Siembras</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.total}
            </p>
            <p className="text-sm text-gray-500 mt-2">Campañas registradas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Área Total */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Área Total</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.areaTotal.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Hectáreas sembradas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* En Curso */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">En Curso</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.enCurso}
            </p>
            <p className="text-sm text-gray-500 mt-2">Siembras activas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cosechadas */}
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cosechadas</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.cosechadas}
            </p>
            <p className="text-sm text-gray-500 mt-2">Campañas finalizadas</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiembraStatsCards
