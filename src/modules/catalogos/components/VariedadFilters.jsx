const VariedadFilters = ({ filters, setFilters, onClear, stats, cultivos }) => {
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
        {/* Cultivo */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Cultivo</h4>
          <select 
            value={filters.cultivoVariedad}
            onChange={(e) => setFilters({ ...filters, cultivoVariedad: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="todos">Todos los cultivos</option>
            {cultivos.map((cultivo) => (
              <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                {cultivo.nombreComun}
              </option>
            ))}
          </select>
        </div>

        {/* Resistencias */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Resistencias</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.resistenciaSequia}
                onChange={(e) => setFilters({ ...filters, resistenciaSequia: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Resistente a sequía
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.resistenciaHelada}
                onChange={(e) => setFilters({ ...filters, resistenciaHelada: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Resistente a heladas
              </span>
            </label>
          </div>
        </div>

        {/* Estado */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
          <div className="space-y-2">
            {[
              { value: 'activo', label: 'Activas', count: stats.variedadesActivas },
              { value: 'inactivo', label: 'Inactivas', count: stats.totalVariedades - stats.variedadesActivas }
            ].map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFilters({ ...filters, estadoVariedad: filters.estadoVariedad === estado.value ? '' : estado.value })}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                  filters.estadoVariedad === estado.value
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-700">{estado.label}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  filters.estadoVariedad === estado.value
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

export default VariedadFilters
