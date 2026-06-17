import { X, MapPin, Calendar, AlertTriangle, FileText } from 'lucide-react'

export default function AlertaDetalleModal({ alerta, onClose }) {
  if (!alerta) return null

  const getNivelRiesgoBadge = (nivel) => {
    const badges = {
      'CRITICO': { color: 'bg-red-100 text-red-800 border-red-200', icon: '🔴' },
      'ALTO': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🟠' },
      'MEDIO': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡' },
      'BAJO': { color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' }
    }
    const badge = badges[(nivel || '').toUpperCase()] || badges['MEDIO']
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${badge.color}`}>
        <span className="text-lg">{badge.icon}</span>
        Riesgo {nivel}
      </span>
    )
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Alerta Climática
              </h2>
              <p className="text-sm text-red-50">
                {alerta.tipoEvento}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nivel de Riesgo */}
          <div className="flex justify-center">
            {getNivelRiesgoBadge(alerta.nivelRiesgo)}
          </div>

          {/* Estado */}
          <div className="flex justify-center">
            {alerta.activa ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Alerta Activa
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Alerta Cerrada
              </span>
            )}
          </div>

          {/* Ubicación */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Ubicación</h3>
                <p className="text-sm text-blue-800 font-medium">
                  {alerta.region?.nombre || 'N/A'}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  {alerta.region?.provincia || ''}, {alerta.region?.departamento?.nombre || ''}
                </p>
                {alerta.region?.zonaAgroecologica && (
                  <p className="text-xs text-blue-600 mt-1">
                    Zona: {alerta.region.zonaAgroecologica}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Periodo */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="bg-gray-500 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Periodo de la Alerta</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Inicio</p>
                    <p className="text-sm font-medium text-gray-900">{formatFecha(alerta.fechaInicio)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Fin Estimado</p>
                    <p className="text-sm font-medium text-gray-900">{formatFecha(alerta.fechaFin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {alerta.descripcion && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">Descripción</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {alerta.descripcion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Alerta creada el {formatFecha(alerta.creadoEn)}
            </p>
            {alerta.idAlerta && (
              <p className="text-xs text-gray-400 mt-1">
                ID: #{alerta.idAlerta}
              </p>
            )}
          </div>

          {/* Botón Cerrar */}
          <div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
