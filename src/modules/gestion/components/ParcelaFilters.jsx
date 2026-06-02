const ParcelaFilters = ({ filters, setFilters, onClear, stats, departamentos, tiposSuelo }) => {
  const toggleDepartamento = (depto) => {
    const newDeptos = filters.departamento.includes(depto)
      ? filters.departamento.filter(d => d !== depto)
      : [...filters.departamento, depto]
    setFilters({ ...filters, departamento: newDeptos })
  }

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
        {/* Departamento */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Departamento</h4>
          <div className="space-y-2.5">
            {departamentos.map((depto) => (
              <label key={depto.idDepartamento} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departamento.includes(depto.nombre)}
                  onChange={() => toggleDepartamento(depto.nombre)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{depto.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Suelo */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Tipo de Suelo</h4>
          <select 
            value={filters.tipoSuelo}
            onChange={(e) => setFilters({ ...filters, tipoSuelo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="todos">Todos los tipos</option>
            {tiposSuelo.map((tipo) => (
              <option key={tipo.idTipoSuelo} value={tipo.idTipoSuelo}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado de Parcela */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
          <div className="space-y-2">
            {[
              { value: 'activo', label: 'Activas', count: stats.parcelasActivas },
              { value: 'inactivo', label: 'Inactivas', count: stats.totalParcelas - stats.parcelasActivas }
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

export default ParcelaFilters
