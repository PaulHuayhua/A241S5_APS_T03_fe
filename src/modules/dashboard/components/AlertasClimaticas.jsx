export default function AlertasClimaticas({ alertas, onVerTodas }) {
  const getSeveridadStyles = (severidad) => {
    switch (severidad) {
      case 'ALTA':
      case 'CRITICO':
        return 'bg-red-50 border border-red-200'
      case 'MEDIA':
        return 'bg-yellow-50 border border-yellow-200'
      default:
        return 'bg-blue-50 border border-blue-200'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Alertas Climáticas</h3>
          <p className="text-xs text-gray-500 mt-1">{alertas.length} alertas activas</p>
        </div>
        <button 
          onClick={onVerTodas}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all duration-150"
        >
          Ver todas →
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {alertas.length > 0 ? (
            alertas.map((alerta, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg hover:shadow-md transition-all cursor-pointer ${getSeveridadStyles(alerta.severidad)}`}
              >
                <p className="font-medium text-gray-900">{alerta.tipo}</p>
                <p className="text-sm text-gray-600 mt-1">{alerta.mensaje}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No hay alertas activas</p>
          )}
        </div>
      </div>
    </div>
  )
}
