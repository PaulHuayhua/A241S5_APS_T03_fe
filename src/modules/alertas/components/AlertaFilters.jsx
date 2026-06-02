export default function AlertaFilters({ filters, setFilters, onClear, stats }) {
  const tiposEvento = [
    'Sequía',
    'Helada',
    'Inundación',
    'Granizada',
    'Vientos fuertes',
    'Ola de calor',
    'Tormenta eléctrica',
    'Nevada'
  ]

  const toggleTipoEvento = (tipo) => {
    const newTipos = filters.tipoEvento.includes(tipo)
      ? filters.tipoEvento.filter(t => t !== tipo)
      : [...filters.tipoEvento, tipo]
    setFilters({ ...filters, tipoEvento: newTipos })
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
        {/* Tipo de Evento */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Tipo de Evento</h4>
          <div className="space-y-2.5">
            {tiposEvento.map((tipo) => (
              <label key={tipo} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.tipoEvento.includes(tipo)}
                  onChange={() => toggleTipoEvento(tipo)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tipo}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de Riesgo */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Nivel de Riesgo</h4>
          <select
            value={filters.nivelRiesgo}
            onChange={(e) => setFilters({ ...filters, nivelRiesgo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="todos">Todos los niveles</option>
            <option value="CRITICO">🔴 Crítico</option>
            <option value="ALTO">🟠 Alto</option>
            <option value="MEDIO">🟡 Medio</option>
            <option value="BAJO">🟢 Bajo</option>
          </select>
        </div>

        {/* Estado de Alerta */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
          <div className="space-y-2">
            {[
              { value: 'activa', label: 'Activas', count: stats.alertasActivas },
              { value: 'cerrada', label: 'Cerradas', count: stats.alertasCerradas }
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
