const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Total Cultivos
            </p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.totalCultivos}
            </p>
            <p className="text-sm text-gray-500 mt-2">Registrados</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Cultivos Activos
            </p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.cultivosActivos}
            </p>
            <p className="text-sm text-gray-500 mt-2">En uso</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Total Variedades
            </p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.totalVariedades}
            </p>
            <p className="text-sm text-gray-500 mt-2">Disponibles</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tipos de Cultivo
            </p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
              {stats.tiposCultivo}
            </p>
            <p className="text-sm text-gray-500 mt-2">Categorías</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
