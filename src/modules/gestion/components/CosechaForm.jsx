import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cosechaService } from '../services/cosecha.service'
import { siembraService } from '../services/siembra.service'

const metodosOptions = [
  { value: 'bascula', label: 'Báscula (Pesaje directo)' },
  { value: 'estimado', label: 'Estimado (Proyección)' }
]

const calidadOptions = [
  { value: 'primera', label: 'Primera' },
  { value: 'segunda', label: 'Segunda' },
  { value: 'tercera', label: 'Tercera' },
  { value: 'descarte', label: 'Descarte' }
]

const CosechaForm = ({ cosecha, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [siembras, setSiembras] = useState([])
  
  const [formData, setFormData] = useState({
    idSiembra: '',
    fechaCosecha: '',
    areaCosechadaHa: '',
    produccionKg: '',
    metodoMedicion: 'bascula',
    calidadGrado: 'primera',
    humedadPct: '',
    notas: ''
  })

  useEffect(() => {
    loadSiembras()
  }, [])

  useEffect(() => {
    if (cosecha) {
      setFormData({
        idSiembra: cosecha.siembra?.idSiembra || '',
        fechaCosecha: cosecha.fechaCosecha || '',
        areaCosechadaHa: cosecha.areaCosechadaHa || '',
        produccionKg: cosecha.produccionKg || '',
        metodoMedicion: cosecha.metodoMedicion || 'bascula',
        calidadGrado: cosecha.calidadGrado || 'primera',
        humedadPct: cosecha.humedadPct || '',
        notas: cosecha.notas || ''
      })
    }
  }, [cosecha])

  const loadSiembras = async () => {
    try {
      const data = await siembraService.getAll()
      // Filtrar siembras en curso o la siembra actual si estamos en modo edición
      const siembrasActivas = data.filter(s => s.estado === 'en_curso' || (cosecha && s.idSiembra === cosecha.siembra?.idSiembra))
      setSiembras(siembrasActivas)
    } catch (error) {
      console.error('Error al cargar siembras:', error)
      toast.error('Error al cargar las siembras')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.idSiembra || !formData.fechaCosecha || !formData.areaCosechadaHa || !formData.produccionKg) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    try {
      setLoading(true)

      // Calcular rendimiento automáticamente
      const rendimientoTonHa = (parseFloat(formData.produccionKg) / 1000) / parseFloat(formData.areaCosechadaHa)

      const cosechaData = {
        siembra: { idSiembra: parseInt(formData.idSiembra) },
        usuario: { idUsuario: 2 }, // Usuario por defecto (sesión activa)
        fechaCosecha: formData.fechaCosecha,
        areaCosechadaHa: parseFloat(formData.areaCosechadaHa),
        produccionKg: parseFloat(formData.produccionKg),
        rendimientoTonHa: rendimientoTonHa,
        metodoMedicion: formData.metodoMedicion,
        calidadGrado: formData.calidadGrado,
        humedadPct: formData.humedadPct ? parseFloat(formData.humedadPct) : null,
        notas: formData.notas || null
      }

      if (cosecha) {
        await cosechaService.update(cosecha.idCosecha, cosechaData)
        toast.success('Cosecha actualizada correctamente')
      } else {
        await cosechaService.create(cosechaData)
        toast.success('Cosecha registrada correctamente')
      }

      onSuccess()
    } catch (error) {
      console.error('Error al guardar cosecha:', error)
      toast.error('Error al guardar la cosecha')
    } finally {
      setLoading(false)
    }
  }

  // Calcular rendimiento en tiempo real
  const rendimientoCalculado = formData.areaCosechadaHa && formData.produccionKg
    ? ((parseFloat(formData.produccionKg) / 1000) / parseFloat(formData.areaCosechadaHa)).toFixed(2)
    : '0.00'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {cosecha ? 'Editar Cosecha' : 'Nueva Cosecha'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Siembra */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Siembra (Campaña) *
              </label>
              <select 
                name="idSiembra"
                value={formData.idSiembra}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
                disabled={cosecha} // No permitir cambiar siembra al editar
              >
                <option value="">Seleccionar siembra</option>
                {siembras.map((siembra) => (
                  <option key={siembra.idSiembra} value={siembra.idSiembra}>
                    {siembra.codigoCampana} - {siembra.variedad?.cultivo?.nombreComun} ({siembra.parcela?.nombreParcela})
                  </option>
                ))}
              </select>
              {siembras.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No hay siembras disponibles para cosechar</p>
              )}
            </div>

            {/* Fecha Cosecha */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Fecha de Cosecha *
              </label>
              <input 
                type="date" 
                name="fechaCosecha"
                value={formData.fechaCosecha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Área Cosechada */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Área Cosechada (ha) *
              </label>
              <input 
                type="number" 
                name="areaCosechadaHa"
                value={formData.areaCosechadaHa}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Cantidad Cosechada */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Cantidad Cosechada (kg) *
              </label>
              <input 
                type="number" 
                name="produccionKg"
                value={formData.produccionKg}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Rendimiento (calculado automáticamente) */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Rendimiento (calculado)
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                <span className="text-primary-600 font-semibold">{rendimientoCalculado} ton/ha</span>
              </div>
            </div>

            {/* Método de Cosecha */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Método de Cosecha *
              </label>
              <select 
                name="metodoMedicion"
                value={formData.metodoMedicion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                {metodosOptions.map((metodo) => (
                  <option key={metodo.value} value={metodo.value}>
                    {metodo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Calidad */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Calidad Promedio *
              </label>
              <select 
                name="calidadGrado"
                value={formData.calidadGrado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                {calidadOptions.map((calidad) => (
                  <option key={calidad.value} value={calidad.value}>
                    {calidad.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Humedad */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Humedad (%)
              </label>
              <input 
                type="number" 
                name="humedadPct"
                value={formData.humedadPct}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Observaciones */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Observaciones
              </label>
              <textarea 
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
                placeholder="Observaciones sobre la cosecha..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || siembras.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {cosecha ? 'Actualizar' : 'Registrar'} Cosecha
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CosechaForm
