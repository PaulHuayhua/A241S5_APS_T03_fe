import { useState, useEffect } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useApi from '../../../shared/hooks/useApi'
import { variedadService } from '../services/variedad.service'
import { groqService } from '../services/groq.service'

const VariedadForm = ({ variedad, cultivos, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    idCultivo: '',
    nombreVariedad: '',
    codigo: '',
    cicloDias: '',
    rendimientoReferenciaTonHa: '',
    resistenciaSequia: false,
    resistenciaHelada: false,
    caracteristicas: '',
  })
  const [loadingAI, setLoadingAI] = useState(false)

  const { execute: saveVariedad, loading } = useApi(
    variedad ? variedadService.update : variedadService.create
  )

  useEffect(() => {
    if (variedad) {
      setFormData({
        idCultivo: variedad.cultivo?.idCultivo?.toString() || '',
        nombreVariedad: variedad.nombreVariedad || '',
        codigo: variedad.codigo || '',
        cicloDias: variedad.cicloDias?.toString() || '',
        rendimientoReferenciaTonHa: variedad.rendimientoReferenciaTonHa?.toString() || '',
        resistenciaSequia: variedad.resistenciaSequia || false,
        resistenciaHelada: variedad.resistenciaHelada || false,
        caracteristicas: variedad.caracteristicas || '',
      })
    }
  }, [variedad])

  const handleAutocompletar = async () => {
    if (!formData.idCultivo || !formData.nombreVariedad || formData.nombreVariedad.trim().length < 2) {
      toast.error('Selecciona el cultivo e ingresa el nombre de la variedad')
      return
    }

    try {
      setLoadingAI(true)
      const loadingToast = toast.loading('🤖 Consultando IA...')
      
      const cultivoSeleccionado = cultivos.find(c => c.idCultivo === parseInt(formData.idCultivo))
      const datos = await groqService.autocompletarVariedad(
        cultivoSeleccionado.nombreComun,
        formData.nombreVariedad
      )
      
      setFormData(prev => ({
        ...prev,
        codigo: prev.codigo || datos.codigo || '',
        cicloDias: prev.cicloDias || datos.cicloDias?.toString() || '',
        rendimientoReferenciaTonHa: prev.rendimientoReferenciaTonHa || datos.rendimientoReferenciaTonHa?.toString() || '',
        resistenciaSequia: datos.resistenciaSequia || prev.resistenciaSequia,
        resistenciaHelada: datos.resistenciaHelada || prev.resistenciaHelada,
        caracteristicas: prev.caracteristicas || datos.caracteristicas || ''
      }))
      
      toast.dismiss(loadingToast)
      toast.success('¡Datos autocompletados con IA! ✨', { duration: 3000 })
    } catch (error) {
      console.error('Error al autocompletar variedad:', error)
      toast.error('Error al consultar IA')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.idCultivo || !formData.nombreVariedad) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      const payload = {
        cultivo: { idCultivo: parseInt(formData.idCultivo) },
        nombreVariedad: formData.nombreVariedad,
        codigo: formData.codigo || null,
        cicloDias: formData.cicloDias ? parseInt(formData.cicloDias) : null,
        rendimientoReferenciaTonHa: formData.rendimientoReferenciaTonHa ? parseFloat(formData.rendimientoReferenciaTonHa) : null,
        resistenciaSequia: formData.resistenciaSequia,
        resistenciaHelada: formData.resistenciaHelada,
        caracteristicas: formData.caracteristicas || null,
        activo: variedad?.activo ?? true
      }

      if (variedad) {
        await saveVariedad(variedad.idVariedad, payload)
        toast.success('Variedad actualizada correctamente')
      } else {
        await saveVariedad(payload)
        toast.success('Variedad creada correctamente')
      }
      onSuccess()
    } catch (error) {
      console.error('Error al guardar variedad:', error)
      toast.error('Error al guardar la variedad')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {variedad ? 'Editar Variedad' : 'Nueva Variedad'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Complete los datos de la variedad</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* AI Autocomplete Button */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Autocompletar con IA
                </h3>
                <p className="text-xs text-gray-600">
                  Completa automáticamente los campos con inteligencia artificial
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutocompletar}
                disabled={loadingAI || !formData.idCultivo || !formData.nombreVariedad}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Autocompletar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cultivo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultivo *
              </label>
              <select
                name="idCultivo"
                value={formData.idCultivo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccione un cultivo</option>
                {cultivos.filter(c => c.activo).map((cultivo) => (
                  <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                    {cultivo.nombreComun}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre de Variedad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Variedad *
              </label>
              <input
                type="text"
                name="nombreVariedad"
                value={formData.nombreVariedad}
                onChange={handleChange}
                required
                placeholder="Ej: Blanco Gigante"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ej: MBG-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Ciclo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciclo (días)
              </label>
              <input
                type="number"
                name="cicloDias"
                value={formData.cicloDias}
                onChange={handleChange}
                min="1"
                placeholder="Ej: 150"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Rendimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rendimiento (ton/ha)
              </label>
              <input
                type="number"
                name="rendimientoReferenciaTonHa"
                value={formData.rendimientoReferenciaTonHa}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="Ej: 6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Resistencias */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resistencias
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="resistenciaSequia"
                    checked={formData.resistenciaSequia}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Resistente a sequía</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="resistenciaHelada"
                    checked={formData.resistenciaHelada}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Resistente a heladas</span>
                </label>
              </div>
            </div>

            {/* Características */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características
              </label>
              <textarea
                name="caracteristicas"
                value={formData.caracteristicas}
                onChange={handleChange}
                rows="3"
                placeholder="Describe las características principales de la variedad..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VariedadForm
