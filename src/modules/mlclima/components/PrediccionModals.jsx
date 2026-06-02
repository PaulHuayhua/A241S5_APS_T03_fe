import { X } from 'lucide-react'

export function ModalDetalle({ prediccion, onClose }) {
  if (!prediccion) return null

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Detalles de la Predicción</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">ID Predicción</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">{prediccion.idPrediccion}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Predicción</label>
              <p className="text-sm text-gray-900 mt-1">{formatearFecha(prediccion.fechaPrediccion)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Parcela</label>
              <p className="text-sm text-gray-900 mt-1">{prediccion.siembra?.parcela?.nombreParcela || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Cultivo</label>
              <p className="text-sm text-gray-900 mt-1">{prediccion.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Modelo ML</label>
              <p className="text-sm text-gray-900 mt-1">{prediccion.modelo?.nombreModelo || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fuente Clima</label>
              <p className="text-sm text-gray-900 mt-1">{prediccion.fuenteClima || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Período Climático</label>
              <p className="text-sm text-gray-900 mt-1">
                {formatearFecha(prediccion.fechaClimaInicio)} a {formatearFecha(prediccion.fechaClimaFin)}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Intervalo de Confianza</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">{prediccion.intervaloConfianzaPct}%</p>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Rendimiento Estimado</label>
              <div className="mt-2 p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-900">{prediccion.rendimientoEstimadoTonHa} ton/ha</p>
                <p className="text-sm text-primary-700 mt-1">
                  Rango: {prediccion.rendimientoMinTonHa} - {prediccion.rendimientoMaxTonHa} ton/ha
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
              <span className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold uppercase mt-2 ${
                prediccion.estado === 'activa' 
                  ? 'bg-green-100 text-green-700'
                  : prediccion.estado === 'evaluada'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {prediccion.estado}
              </span>
            </div>
            {prediccion.notas && (
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
                <p className="text-sm text-gray-900 mt-1">{prediccion.notas}</p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModalCambiarEstado({ prediccion, onConfirmar, onClose }) {
  if (!prediccion) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cambiar Estado</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            Predicción: <span className="font-semibold">{prediccion.siembra?.parcela?.nombreParcela} - {prediccion.siembra?.variedad?.cultivo?.nombreComun}</span>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Estado actual: <span className="font-semibold">{prediccion.estado}</span>
          </p>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Nuevo Estado
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onConfirmar('activa')}
              className="w-full px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium text-left"
            >
              Activa
            </button>
            <button
              onClick={() => onConfirmar('evaluada')}
              className="w-full px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium text-left"
            >
              Evaluada
            </button>
            <button
              onClick={() => onConfirmar('descartada')}
              className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium text-left"
            >
              Descartada
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModalEliminar({ prediccion, onConfirmar, onClose }) {
  if (!prediccion) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700">
            ¿Estás seguro de que deseas eliminar la predicción de <span className="font-semibold">{prediccion.siembra?.parcela?.nombreParcela || 'N/A'} - {prediccion.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirmar}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
