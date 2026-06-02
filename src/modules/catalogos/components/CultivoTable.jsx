import { Edit, Trash2, RotateCcw, Sparkles } from 'lucide-react'

const CultivoTable = ({ cultivos, onEdit, onDelete, onRestore, loading }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando cultivos...</p>
      </div>
    )
  }

  if (cultivos.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
        <p className="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          Limpiar filtros
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ciclo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Temp. Óptima</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</span>
            </th>
            <th className="px-6 py-3 text-center">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cultivos.map((cultivo) => (
            <tr 
              key={cultivo.idCultivo} 
              className={`bg-white hover:bg-gray-50 transition-colors ${!cultivo.activo ? 'opacity-60' : ''}`}
            >
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cultivo.nombreComun}</p>
                  <p className="text-xs text-gray-500 italic">{cultivo.nombreCientifico || 'N/A'}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase bg-green-100 text-green-700">
                  {cultivo.tipoCultivo}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">{cultivo.cicloDiasPromedio || 'N/A'} días</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">
                  {cultivo.tempOptimaMinC && cultivo.tempOptimaMaxC 
                    ? `${cultivo.tempOptimaMinC}°C - ${cultivo.tempOptimaMaxC}°C`
                    : 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                  cultivo.activo 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {cultivo.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(cultivo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {cultivo.activo ? (
                    <button
                      onClick={() => onDelete(cultivo)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Desactivar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(cultivo)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Restaurar"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CultivoTable
