import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToExcel } from '../utils/exportUtils'

/**
 * Botón reutilizable para exportar datos a Excel
 * @param {Array} data - Datos a exportar
 * @param {String} fileName - Nombre del archivo (sin extensión)
 * @param {String} sheetName - Nombre de la hoja
 * @param {Function} prepareData - Función opcional para transformar datos
 * @param {String} label - Texto del botón
 * @param {String} className - Clases CSS adicionales
 */
export default function ExportButton({ 
  data, 
  fileName, 
  sheetName = 'Datos',
  prepareData = null,
  label = 'Exportar',
  className = ''
}) {
  const handleExport = () => {
    try {
      if (!data || data.length === 0) {
        toast.error('No hay datos para exportar')
        return
      }

      // Preparar datos si se proporciona función de transformación
      const dataToExport = prepareData ? prepareData(data) : data

      // Generar nombre de archivo con fecha si no se especifica
      const fecha = new Date().toISOString().split('T')[0]
      const finalFileName = fileName || `Exportacion_${fecha}`

      // Exportar
      exportToExcel(dataToExport, finalFileName, sheetName)

      toast.success(`${data.length} registros exportados correctamente`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar los datos')
    }
  }

  return (
    <button 
      onClick={handleExport}
      className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 ${className}`}
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  )
}
