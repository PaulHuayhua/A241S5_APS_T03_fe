export default function FiltersPanel({ filters, setFilters, onClear }) {
  const toggleRegion = (region) => {
    const newRegions = filters.region.includes(region)
      ? filters.region.filter(r => r !== region)
      : [...filters.region, region]
    setFilters({ ...filters, region: newRegions })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">FILTROS</h3>
        <button 
          onClick={onClear}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Limpiar todo
        </button>
      </div>

      <div className="space-y-6">
        {/* Región con Checkboxes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Región</h4>
          <div className="space-y-2">
            {['Valle Central', 'Delta Norte', 'Llanuras del Sur'].map((region) => (
              <label key={region} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.region.includes(region)}
                  onChange={() => toggleRegion(region)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de Cultivo - Dropdown */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Tipo de Cultivo</h4>
          <select 
            value={filters.cultivo}
            onChange={(e) => setFilters({ ...filters, cultivo: e.target.value })}
            className="input w-full"
          >
            <option value="todos">Todos los cultivos</option>
            <option value="papa">Papa</option>
            <option value="maiz">Maíz</option>
            <option value="quinua">Quinua</option>
            <option value="trigo">Trigo</option>
          </select>
        </div>

        {/* Estado de Cultivo - Botones con contador */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Estado de Cultivo</h4>
          <div className="space-y-2">
            {[
              { value: 'en_curso', label: 'En curso', count: 8 },
              { value: 'cosechada', label: 'Cosechada', count: 4 },
              { value: 'perdida', label: 'Perdida', count: 1 }
            ].map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFilters({ ...filters, estado: estado.value })}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  filters.estado === estado.value
                    ? 'bg-primary-50 border-primary-600 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className={`text-sm font-medium ${
                  filters.estado === estado.value ? 'text-primary-900' : 'text-gray-700'
                }`}>
                  {estado.label}
                </span>
                <span className={`text-sm px-2.5 py-1 rounded-md font-semibold ${
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
