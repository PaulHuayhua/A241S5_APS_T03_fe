import { Eye, Edit, Trash2 } from 'lucide-react'

const CosechaTable = ({ cosechas, onView, onEdit, onDelete, loading }) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`
  }

  const getCalidadBadge = (calidad) => {
    const badges = {
      primera: { className: 'bg-green-100 text-green-700', label: 'Primera' },
      segunda: { className: 'bg-yellow-100 text-yellow-700', label: 'Segunda' },
      tercera: { className: 'bg-orange-100 text-orange-700', label: 'Tercera' },
      descarte: { className: 'bg-red-100 text-red-700', label: 'Descarte' }
    }
    
    const key = calidad?.toLowerCase()
    return badges[key] || { 
      className: 'bg-gray-100 text-gray-700', 
      label: calidad || 'N/A' 
    }
  }

  const getMetodoBadge = (metodo) => {
    const badges = {
      manual: { className: 'bg-blue-50 text-blue-700', label: 'Manual' },
      mecanizada: { className: 'bg-purple-50 text-purple-700', label: 'Mecanizada' },
      mixta: { className: 'bg-indigo-50 text-indigo-700', label: 'Mixta' },
      bascula: { className: 'bg-teal-50 text-teal-700', label: 'Báscula' },
      estimado: { className: 'bg-amber-50 text-amber-700', label: 'Estimado' },
      pesaje: { className: 'bg-cyan-50 text-cyan-700', label: 'Pesaje' }
    }
    
    const key = metodo?.toLowerCase()
    return badges[key] || { 
      className: 'bg-gray-50 text-gray-700', 
      label: metodo || 'N/A' 
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cosechas...</p>
        </div>
      </div>
    )
  }

  if (cosechas.length === 0) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-1">No se encontraron cosechas</p>
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
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Siembra</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Área (ha)</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Producción</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rendimiento</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Calidad</span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Método</span>
            </th>
            <th className="px-6 py-3 text-center">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cosechas.map((cosecha) => {
            const calidadBadge = getCalidadBadge(cosecha.calidadGrado)
            const metodoBadge = getMetodoBadge(cosecha.metodoMedicion)
            
            return (
              <tr key={cosecha.idCosecha} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatearFecha(cosecha.fechaCosecha)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cosecha.siembra?.codigoCampana || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cosecha.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {cosecha.areaCosechadaHa || '0'} ha
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {cosecha.produccionKg ? (cosecha.produccionKg / 1000).toFixed(2) : '0.00'} ton
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cosecha.produccionKg ? Number(cosecha.produccionKg).toFixed(0) : '0'} kg
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-primary-600">
                    {cosecha.rendimientoTonHa ? cosecha.rendimientoTonHa.toFixed(1) : '0.0'} ton/ha
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${calidadBadge.className}`}>
                    {calidadBadge.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${metodoBadge.className}`}>
                    {metodoBadge.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {onView && (
                      <button 
                        onClick={() => onView(cosecha)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => onEdit(cosecha)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(cosecha)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default CosechaTable
