import { Eye, Edit, Trash2, RefreshCw } from 'lucide-react'

const ParcelaTable = ({ parcelas, onView, onEdit, onDelete, onRestore, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parcelas...</p>
        </div>
      </div>
    )
  }

  if (parcelas.length === 0) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-1">No se encontraron parcelas</p>
        <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Código</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Parcela</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo Suelo</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Área</span>
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
          {parcelas.map((parcela) => (
            <tr key={parcela.idParcela} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                  {parcela.codigoCatastral || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{parcela.nombreParcela}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {parcela.region?.nombre} - {parcela.region?.provincia}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{parcela.tipoSuelo?.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{parcela.sistemaRiego}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">{parcela.areaHectareas} ha</span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                  parcela.activo 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {parcela.activo ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  {onView && (
                    <button 
                      onClick={() => onView(parcela)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => onEdit(parcela)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {parcela.activo ? (
                    <button 
                      onClick={() => onDelete(parcela)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Desactivar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onRestore(parcela)}
                      className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                      title="Restaurar"
                    >
                      <RefreshCw className="w-4 h-4" />
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

export default ParcelaTable
