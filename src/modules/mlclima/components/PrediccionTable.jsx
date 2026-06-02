import { Eye, RefreshCw, Trash2, Download, Brain } from 'lucide-react'
import { exportToExcel, formatearFechaExcel, formatearNumeroExcel } from '../../../shared/utils/exportUtils'
import toast from 'react-hot-toast'

export default function PrediccionTable({
  predicciones,
  onVerDetalle,
  onCambiarEstado,
  onEliminar,
  onExportar
}) {
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleExportarLocal = () => {
    if (predicciones.length === 0) {
      toast.error('No hay predicciones para exportar')
      return
    }

    try {
      const datosExportar = predicciones.map(pred => ({
        'ID': pred.idPrediccion,
        'Fecha': formatearFechaExcel(pred.fechaPrediccion),
        'Parcela': pred.siembra?.parcela?.nombreParcela || 'N/A',
        'Cultivo': pred.siembra?.variedad?.cultivo?.nombreComun || 'N/A',
        'Modelo': pred.modelo?.nombreModelo || 'N/A',
        'Rendimiento Estimado': formatearNumeroExcel(pred.rendimientoEstimadoTonHa),
        'Rango Mínimo': formatearNumeroExcel(pred.rendimientoMinTonHa),
        'Rango Máximo': formatearNumeroExcel(pred.rendimientoMaxTonHa),
        'Confianza (%)': formatearNumeroExcel(pred.intervaloConfianzaPct),
        'Estado': pred.estado
      }))

      const fecha = new Date().toISOString().split('T')[0]
      exportToExcel(datosExportar, `Predicciones_${fecha}`, 'Predicciones')
      toast.success(`${predicciones.length} predicciones exportadas`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Historial de Predicciones</h3>
          <p className="text-xs text-gray-500 mt-0.5">{predicciones.length} predicciones generadas</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onExportar || handleExportarLocal}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left bg-gray-50 w-32">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50 w-48">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Siembra</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50 w-44">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Modelo ML</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50 w-44">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rendimiento</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50 w-32">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</span>
              </th>
              <th className="px-6 py-3 text-center bg-gray-50 w-32">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {predicciones.length > 0 ? (
              predicciones.map((pred) => (
                <tr key={pred.idPrediccion} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap align-middle">
                    <span className="text-sm font-medium text-gray-900">{formatearFecha(pred.fechaPrediccion)}</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="max-w-[180px]">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{pred.siembra?.parcela?.nombreParcela || 'N/A'}</p>
                      <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">{pred.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap align-middle">
                    <span className="text-sm text-gray-700">{pred.modelo?.nombreModelo || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap align-middle">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {pred.rendimientoEstimadoTonHa?.toFixed(2) || 'N/A'} ton/ha
                      </p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">
                        {pred.rendimientoMinTonHa?.toFixed(2) || 'N/A'}-{pred.rendimientoMaxTonHa?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      pred.estado === 'activa' 
                        ? 'bg-green-100 text-green-800'
                        : pred.estado === 'evaluada'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pred.estado?.charAt(0).toUpperCase() + pred.estado?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => onVerDetalle(pred)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onCambiarEstado(pred)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Cambiar estado"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEliminar(pred)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Brain className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-900 font-semibold mb-1">No hay predicciones registradas</p>
                    <p className="text-sm text-gray-500 mb-4">Genera tu primera predicción usando el formulario</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
