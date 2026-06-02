import { Eye, Edit, Trash2 } from 'lucide-react'

const SiembraTable = ({ siembras, onView, onEdit, onDelete, loading }) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`
  }

  const calcularDiasTranscurridos = (fechaSiembra) => {
    if (!fechaSiembra) return 0
    const hoy = new Date()
    const fecha = new Date(fechaSiembra)
    const diferencia = hoy - fecha
    return Math.floor(diferencia / (1000 * 60 * 60 * 24))
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      en_curso: 'bg-green-100 text-green-700',
      cosechada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
      perdida: 'bg-gray-200 text-gray-700'
    }
    
    const labels = {
      en_curso: 'EN CURSO',
      cosechada: 'COSECHADA',
      cancelada: 'CANCELADA',
      perdida: 'PERDIDA'
    }

    return {
      className: badges[estado] || 'bg-gray-200 text-gray-700',
      label: labels[estado] || estado.toUpperCase()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando siembras...</p>
        </div>
      </div>
    )
  }

  if (siembras.length === 0) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-1">No se encontraron siembras</p>
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
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo / Variedad</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha Siembra</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Área</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Días</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</span>
            </th>
            <th className="px-6 py-3 text-center">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Acción</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {siembras.map((siembra) => {
            const estadoBadge = getEstadoBadge(siembra.estado)
            const diasTranscurridos = calcularDiasTranscurridos(siembra.fechaSiembra)
            
            return (
              <tr key={siembra.idSiembra} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {siembra.codigoCampana}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{siembra.parcela?.nombreParcela || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{siembra.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{siembra.variedad?.nombreVariedad || 'N/A'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{formatearFecha(siembra.fechaSiembra)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">{siembra.areaSembradaHa} ha</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{diasTranscurridos}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${estadoBadge.className}`}>
                    {estadoBadge.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {onView && (
                      <button 
                        onClick={() => onView(siembra)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {siembra.estado === 'en_curso' && (
                      <>
                        <button 
                          onClick={() => onEdit(siembra)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(siembra)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Cancelar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SiembraTable
