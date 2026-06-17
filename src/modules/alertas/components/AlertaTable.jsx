import { Eye, Power, PowerOff, Trash2, Edit } from 'lucide-react'

export default function AlertaTable({ 
  alertas, 
  onVerDetalle,
  onEdit,
  onActivar, 
  onDesactivar, 
  onEliminar,
  loading
}) {
  const getNivelRiesgoBadge = (nivel) => {
    const badges = {
      'CRITICO': { color: 'bg-red-100 text-red-800', icon: '🔴' },
      'ALTO': { color: 'bg-orange-100 text-orange-800', icon: '🟠' },
      'MEDIO': { color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      'BAJO': { color: 'bg-green-100 text-green-800', icon: '🟢' }
    }
    const badge = badges[(nivel || '').toUpperCase()] || badges['MEDIO']
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
        <span>{badge.icon}</span>
        {nivel}
      </span>
    )
  }

  const getEstadoBadge = (activa) => {
    return activa ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        Activa
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        Cerrada
      </span>
    )
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '-'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Lista de Alertas Climáticas</h3>
        <p className="text-xs text-gray-500 mt-0.5">{alertas.length} alertas registradas</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Región</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo de Evento</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nivel de Riesgo</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha Inicio</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha Fin</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</span>
              </th>
              <th className="px-6 py-3 text-center bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {alertas.length > 0 ? (
              alertas.map((alerta) => (
                <tr key={alerta.idAlerta} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {alerta.region?.nombre || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {alerta.region?.provincia || ''}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span className="text-sm text-gray-900">{alerta.tipoEvento}</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    {getNivelRiesgoBadge(alerta.nivelRiesgo)}
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{formatFecha(alerta.fechaInicio)}</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{formatFecha(alerta.fechaFin)}</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    {getEstadoBadge(alerta.activa)}
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onVerDetalle(alerta)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(alerta)}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {alerta.activa ? (
                        <button
                          onClick={() => onDesactivar(alerta.idAlerta)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Cerrar alerta"
                        >
                          <PowerOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivar(alerta.idAlerta)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Reactivar alerta"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEliminar(alerta)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <td colSpan="7" className="px-6 py-16 text-center">
                  <p className="text-gray-500">No hay alertas registradas</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
