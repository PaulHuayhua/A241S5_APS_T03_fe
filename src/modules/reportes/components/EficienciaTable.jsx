import { exportToExcel, formatearFechaExcel, formatearNumeroExcel } from '../../../shared/utils/exportUtils'
import toast from 'react-hot-toast'

export default function EficienciaTable({ campanas, filtroTipo, setFiltroTipo }) {
  const handleExportarLocal = () => {
    if (campanas.length === 0) {
      toast.error('No hay campañas para exportar')
      return
    }

    try {
      const datosExportar = campanas.map(camp => ({
        'Parcela': camp.parcela,
        'Cultivo': camp.cultivo,
        'Área (ha)': formatearNumeroExcel(camp.area_ha),
        'Rendimiento Real': formatearNumeroExcel(camp.rendimiento_real),
        'Rendimiento Esperado': formatearNumeroExcel(camp.rendimiento_esperado),
        'Efic. Productiva (%)': formatearNumeroExcel(camp.eficiencia_productiva, 1),
        'ROI (%)': formatearNumeroExcel(camp.roi, 1),
        'Margen (%)': formatearNumeroExcel(camp.margen_neto, 1),
        'Efic. Riego (%)': formatearNumeroExcel(camp.eficiencia_riego, 0)
      }))

      const fecha = new Date().toISOString().split('T')[0]
      exportToExcel(datosExportar, `Campanas_${fecha}`, 'Campañas')
      toast.success(`${campanas.length} campañas exportadas`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Detalle por Campaña</h3>
          <p className="text-xs text-gray-500 mt-0.5">{campanas.length} campañas analizadas</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <option value="todas">Todas las campañas</option>
            <option value="activas">Solo activas</option>
            <option value="finalizadas">Finalizadas</option>
          </select>
          <button 
            onClick={handleExportarLocal}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Exportar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Parcela</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cultivo</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Área (ha)</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rendimiento</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Efic. Prod.</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">ROI</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Margen</span>
              </th>
              <th className="px-6 py-3 text-left bg-gray-50">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Efic. Riego</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {campanas.length > 0 ? (
              campanas.map((campana) => (
                <tr key={campana.id_unico} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 align-middle">
                    <span className="text-sm font-semibold text-gray-900">{campana.parcela}</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span className="text-sm text-gray-700">{campana.cultivo}</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campana.area_ha} ha</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{campana.rendimiento_real} ton/ha</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">Esp: {campana.rendimiento_esperado}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      campana.eficiencia_productiva >= 100
                        ? 'bg-green-100 text-green-800'
                        : campana.eficiencia_productiva >= 95
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {campana.eficiencia_productiva}%
                    </span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-700">{campana.roi}%</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-700">{campana.margen_neto}%</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campana.eficiencia_riego}%</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center">
                  <p className="text-gray-500">No hay campañas para mostrar</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
