const CultivoFilters = ({ filters, setFilters, onClear, stats, tiposCultivo }) => {
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 sticky top-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filtros</h3>
        <button 
          onClick={onClear}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-6">
        {/* Tipo de Cultivo */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Tipo de Cultivo</h4>
          <select 
            value={filters.tipoCultivo}
            onChange={(e) => setFilters({ ...filters, tipoCultivo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="todos">Todos los tipos</option>
            {tiposCultivo.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
          <div className="space-y-2">
            {[
              { value: 'activo', label: 'Activos', count: stats.cultivosActivos },
              { value: 'inactivo', label: 'Inactivos', count: stats.totalCultivos - stats.cultivosActivos }
            ].map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFilters({ ...filters, estado: filters.estado === estado.value ? '' : estado.value })}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                  filters.estado === estado.value
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-700">{estado.label}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  filters.estado === estado.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {estado.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CultivoFilters
