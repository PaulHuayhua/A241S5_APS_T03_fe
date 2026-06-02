import { useState, useEffect } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useApi from '../../../shared/hooks/useApi'
import { cultivoService } from '../services/cultivo.service'
import { groqService } from '../services/groq.service'

const CultivoForm = ({ cultivo, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreComun: '',
    nombreCientifico: '',
    tipoCultivo: '',
    cicloDiasPromedio: '',
    tempOptimaMinC: '',
    tempOptimaMaxC: '',
    precipitacionMinMm: '',
    precipitacionMaxMm: '',
  })
  const [loadingAI, setLoadingAI] = useState(false)

  const { execute: saveCultivo, loading } = useApi(
    cultivo ? cultivoService.update : cultivoService.create
  )

  useEffect(() => {
    if (cultivo) {
      setFormData({
        nombreComun: cultivo.nombreComun || '',
        nombreCientifico: cultivo.nombreCientifico || '',
        tipoCultivo: cultivo.tipoCultivo || '',
        cicloDiasPromedio: cultivo.cicloDiasPromedio?.toString() || '',
        tempOptimaMinC: cultivo.tempOptimaMinC?.toString() || '',
        tempOptimaMaxC: cultivo.tempOptimaMaxC?.toString() || '',
        precipitacionMinMm: cultivo.precipitacionMinMm?.toString() || '',
        precipitacionMaxMm: cultivo.precipitacionMaxMm?.toString() || '',
      })
    }
  }, [cultivo])

  const handleAutocompletar = async () => {
    if (!formData.nombreComun || formData.nombreComun.trim().length < 2) {
      toast.error('Ingresa el nombre del cultivo primero')
      return
    }

    try {
      setLoadingAI(true)
      const loadingToast = toast.loading('🤖 Consultando IA...')
      
      const datos = await groqService.autocompletarCultivo(formData.nombreComun)
      
      setFormData(prev => ({
        ...prev,
        nombreCientifico: prev.nombreCientifico || datos.nombreCientifico || '',
        tipoCultivo: prev.tipoCultivo || datos.tipoCultivo || '',
        cicloDiasPromedio: prev.cicloDiasPromedio || datos.cicloDiasPromedio?.toString() || '',
        tempOptimaMinC: prev.tempOptimaMinC || datos.tempOptimaMinC?.toString() || '',
        tempOptimaMaxC: prev.tempOptimaMaxC || datos.tempOptimaMaxC?.toString() || '',
        precipitacionMinMm: prev.precipitacionMinMm || datos.precipitacionMinMm?.toString() || '',
        precipitacionMaxMm: prev.precipitacionMaxMm || datos.precipitacionMaxMm?.toString() || ''
      }))
      
      toast.dismiss(loadingToast)
      toast.success('¡Datos autocompletados con IA! ✨', { duration: 3000 })
    } catch (error) {
      console.error('Error al autocompletar cultivo:', error)
      toast.error('Error al consultar IA')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nombreComun || !formData.tipoCultivo) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      const payload = {
        nombreComun: formData.nombreComun,
        nombreCientifico: formData.nombreCientifico || null,
        tipoCultivo: formData.tipoCultivo,
        cicloDiasPromedio: formData.cicloDiasPromedio ? parseInt(formData.cicloDiasPromedio) : null,
        tempOptimaMinC: formData.tempOptimaMinC ? parseFloat(formData.tempOptimaMinC) : null,
        tempOptimaMaxC: formData.tempOptimaMaxC ? parseFloat(formData.tempOptimaMaxC) : null,
        precipitacionMinMm: formData.precipitacionMinMm ? parseFloat(formData.precipitacionMinMm) : null,
        precipitacionMaxMm: formData.precipitacionMaxMm ? parseFloat(formData.precipitacionMaxMm) : null,
        activo: cultivo?.activo ?? true
      }

      if (cultivo) {
        await saveCultivo(cultivo.idCultivo, payload)
        toast.success('Cultivo actualizado correctamente')
      } else {
        await saveCultivo(payload)
        toast.success('Cultivo creado correctamente')
      }
      onSuccess()
    } catch (error) {
      console.error('Error al guardar cultivo:', error)
      toast.error('Error al guardar el cultivo')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cultivo ? 'Editar Cultivo' : 'Nuevo Cultivo'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Complete los datos del cultivo</p>
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
                disabled={loadingAI || !formData.nombreComun}
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
            {/* Nombre Común */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Común *
              </label>
              <input
                type="text"
                name="nombreComun"
                value={formData.nombreComun}
                onChange={handleChange}
                required
                placeholder="Ej: Maíz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Nombre Científico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Científico
              </label>
              <input
                type="text"
                name="nombreCientifico"
                value={formData.nombreCientifico}
                onChange={handleChange}
                placeholder="Ej: Zea mays"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Tipo de Cultivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cultivo *
              </label>
              <select
                name="tipoCultivo"
                value={formData.tipoCultivo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccione un tipo</option>
                <option value="Cereal">Cereal</option>
                <option value="Leguminosa">Leguminosa</option>
                <option value="Tubérculo">Tubérculo</option>
                <option value="Hortalizas">Hortalizas</option>
                <option value="Frutal">Frutal</option>
                <option value="Forraje">Forraje</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Ciclo de Vida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciclo de Vida (días)
              </label>
              <input
                type="number"
                name="cicloDiasPromedio"
                value={formData.cicloDiasPromedio}
                onChange={handleChange}
                min="1"
                placeholder="Ej: 120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Temperatura Mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura Óptima Mínima (°C)
              </label>
              <input
                type="number"
                name="tempOptimaMinC"
                value={formData.tempOptimaMinC}
                onChange={handleChange}
                step="0.1"
                placeholder="Ej: 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Temperatura Máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura Óptima Máxima (°C)
              </label>
              <input
                type="number"
                name="tempOptimaMaxC"
                value={formData.tempOptimaMaxC}
                onChange={handleChange}
                step="0.1"
                placeholder="Ej: 30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Precipitación Mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precipitación Mínima (mm)
              </label>
              <input
                type="number"
                name="precipitacionMinMm"
                value={formData.precipitacionMinMm}
                onChange={handleChange}
                step="0.1"
                placeholder="Ej: 400"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Precipitación Máxima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precipitación Máxima (mm)
              </label>
              <input
                type="number"
                name="precipitacionMaxMm"
                value={formData.precipitacionMaxMm}
                onChange={handleChange}
                step="0.1"
                placeholder="Ej: 800"
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

export default CultivoForm
