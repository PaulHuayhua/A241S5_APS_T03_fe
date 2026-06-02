import apiService from '../../../shared/services/api.service'

export const groqService = {
  /**
   * Autocompleta datos de un cultivo usando IA
   * @param {string} nombreCultivo - Nombre del cultivo (ej: "Maíz")
   * @returns {Promise<Object>} Datos del cultivo
   */
  autocompletarCultivo: async (nombreCultivo) => {
    try {
      const response = await apiService.get(`/groq/cultivo/autocompletar?nombre=${encodeURIComponent(nombreCultivo)}`)
      return response
    } catch (error) {
      console.error('Error al autocompletar cultivo:', error)
      throw error
    }
  },

  /**
   * Autocompleta datos de una variedad usando IA
   * @param {string} nombreCultivo - Nombre del cultivo
   * @param {string} nombreVariedad - Nombre de la variedad
   * @returns {Promise<Object>} Datos de la variedad
   */
  autocompletarVariedad: async (nombreCultivo, nombreVariedad) => {
    try {
      const response = await apiService.get(
        `/groq/variedad/autocompletar?cultivo=${encodeURIComponent(nombreCultivo)}&variedad=${encodeURIComponent(nombreVariedad)}`
      )
      return response
    } catch (error) {
      console.error('Error al autocompletar variedad:', error)
      throw error
    }
  },

  /**
   * Sugiere variedades para un cultivo
   * @param {string} nombreCultivo - Nombre del cultivo
   * @param {string} region - Región (opcional, default: "Costa")
   * @returns {Promise<Array<string>>} Lista de variedades sugeridas
   */
  sugerirVariedades: async (nombreCultivo, region = 'Costa') => {
    try {
      const response = await apiService.get(
        `/groq/variedades/sugerir?cultivo=${encodeURIComponent(nombreCultivo)}&region=${encodeURIComponent(region)}`
      )
      return response
    } catch (error) {
      console.error('Error al sugerir variedades:', error)
      throw error
    }
  }
}
