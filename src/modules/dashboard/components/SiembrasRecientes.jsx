export default function SiembrasRecientes({ siembras, onVerTodas }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Siembras Recientes</h3>
          <p className="text-xs text-gray-500 mt-1">{siembras.length} siembras registradas</p>
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
          {siembras.length > 0 ? (
            siembras.map((siembra, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{siembra.cultivo}</p>
                  <p className="text-sm text-gray-500">Parcela: {siembra.parcela}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{siembra.fecha}</p>
                  <p className="text-xs text-gray-500">{siembra.area} Ha</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No hay siembras activas registradas</p>
              <button 
                onClick={onVerTodas}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Registrar nueva siembra →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
