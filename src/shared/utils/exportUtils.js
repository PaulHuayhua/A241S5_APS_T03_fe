import * as XLSX from 'xlsx'

/**
 * Exporta datos a un archivo Excel
 * @param {Array} data - Array de objetos a exportar
 * @param {String} fileName - Nombre del archivo (sin extensión)
 * @param {String} sheetName - Nombre de la hoja
 */
export const exportToExcel = (data, fileName, sheetName = 'Datos') => {
  try {
    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new()
    
    // Convertir datos a hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // Ajustar ancho de columnas automáticamente
    const maxWidth = 50
    const colWidths = []
    
    // Obtener headers
    const headers = Object.keys(data[0] || {})
    
    headers.forEach((header, i) => {
      const maxLength = Math.max(
        header.length,
        ...data.map(row => String(row[header] || '').length)
      )
      colWidths[i] = { wch: Math.min(maxLength + 2, maxWidth) }
    })
    
    worksheet['!cols'] = colWidths
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // Generar archivo y descargar
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    throw error
  }
}

/**
 * Exporta múltiples hojas a un archivo Excel
 * @param {Array} sheets - Array de objetos { name, data }
 * @param {String} fileName - Nombre del archivo (sin extensión)
 */
export const exportMultipleSheetsToExcel = (sheets, fileName) => {
  try {
    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new()
    
    // Agregar cada hoja
    sheets.forEach(({ name, data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data)
      
      // Ajustar ancho de columnas
      const maxWidth = 50
      const colWidths = []
      const headers = Object.keys(data[0] || {})
      
      headers.forEach((header, i) => {
        const maxLength = Math.max(
          header.length,
          ...data.map(row => String(row[header] || '').length)
        )
        colWidths[i] = { wch: Math.min(maxLength + 2, maxWidth) }
      })
      
      worksheet['!cols'] = colWidths
      
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    })
    
    // Generar archivo y descargar
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Error al exportar múltiples hojas:', error)
    throw error
  }
}

/**
 * Formatea fecha para Excel
 * @param {String} fecha - Fecha en formato ISO o string
 * @returns {String} Fecha formateada
 */
export const formatearFechaExcel = (fecha) => {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const año = date.getFullYear()
  return `${dia}/${mes}/${año}`
}

/**
 * Formatea número para Excel
 * @param {Number} numero - Número a formatear
 * @param {Number} decimales - Cantidad de decimales
 * @returns {Number} Número formateado
 */
export const formatearNumeroExcel = (numero, decimales = 2) => {
  if (numero === null || numero === undefined) return 0
  return parseFloat(numero.toFixed(decimales))
}
