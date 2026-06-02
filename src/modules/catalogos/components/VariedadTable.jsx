import { Edit, Trash2, RotateCcw, Sparkles } from 'lucide-react'

const VariedadTable = ({ variedades, onEdit, onDelete, onRestore, loading }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando variedades...</p>
      </div>
    )
  }

  if (variedades.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
        <p className="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Variedad</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Código</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ciclo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rendimiento</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Resistencias</span>
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
          {variedades.map((variedad) => (
            <tr 
              key={variedad.idVariedad} 
              className={`bg-white hover:bg-gray-50 transition-colors ${!variedad.activo ? 'opacity-60' : ''}`}
            >
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{variedad.nombreVariedad}</p>
                  {variedad.caracteristicas && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{variedad.caracteristicas}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">{variedad.cultivo?.nombreComun || 'N/A'}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-mono text-gray-600">{variedad.codigo || 'N/A'}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">{variedad.cicloDias || 'N/A'} días</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">
                  {variedad.rendimientoReferenciaTonHa ? `${variedad.rendimientoReferenciaTonHa} ton/ha` : 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1.5">
                  {variedad.resistenciaSequia && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Sequía
                    </span>
                  )}
                  {variedad.resistenciaHelada && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                      Helada
                    </span>
                  )}
                  {!variedad.resistenciaSequia && !variedad.resistenciaHelada && (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                  variedad.activo 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {variedad.activo ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(variedad)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {variedad.activo ? (
                    <button
                      onClick={() => onDelete(variedad)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Desactivar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(variedad)}
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

export default VariedadTable
