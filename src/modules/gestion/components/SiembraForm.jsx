import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { siembraService } from '../services/siembra.service'
import { parcelaService } from '../services/parcela.service'
import { cultivoService, variedadService } from '../../catalogos/services'

const SiembraForm = ({ siembra, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [parcelas, setParcelas] = useState([])
  const [cultivos, setCultivos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [variedadesFiltradas, setVariedadesFiltradas] = useState([])
  
  const [formData, setFormData] = useState({
    idParcela: '',
    idCultivo: '',
    idVariedad: '',
    fechaSiembra: '',
    areaSembradaHa: '',
    densidadPlantasHa: '',
    notas: ''
  })

  useEffect(() => {
    loadCatalogos()
  }, [])

  useEffect(() => {
    if (siembra) {
      setFormData({
        idParcela: siembra.parcela?.idParcela || '',
        idCultivo: siembra.variedad?.cultivo?.idCultivo || '',
        idVariedad: siembra.variedad?.idVariedad || '',
        fechaSiembra: siembra.fechaSiembra || '',
        areaSembradaHa: siembra.areaSembradaHa || '',
        densidadPlantasHa: siembra.densidadPlantasHa || '',
        notas: siembra.notas || ''
      })
    }
  }, [siembra])

  // Filtrar variedades cuando cambia el cultivo
  useEffect(() => {
    if (formData.idCultivo) {
      const filtered = variedades.filter(v => v.cultivo?.idCultivo === parseInt(formData.idCultivo))
      setVariedadesFiltradas(filtered)
      
      // Resetear variedad si no está en las filtradas
      if (formData.idVariedad && !filtered.find(v => v.idVariedad === parseInt(formData.idVariedad))) {
        setFormData(prev => ({ ...prev, idVariedad: '' }))
      }
    } else {
      setVariedadesFiltradas([])
    }
  }, [formData.idCultivo, variedades])

  const loadCatalogos = async () => {
    try {
      const [parcelasRes, cultivosRes, variedadesRes] = await Promise.all([
        parcelaService.getAll(),
        cultivoService.getAll(),
        variedadService.getAll()
      ])
      setParcelas(parcelasRes.filter(p => p.activo))
      setCultivos(cultivosRes.filter(c => c.activo))
      setVariedades(variedadesRes.filter(v => v.activo))
    } catch (error) {
      console.error('Error al cargar catálogos:', error)
      toast.error('Error al cargar los catálogos')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar variedad cuando cambie el cultivo
    if (name === 'idCultivo') {
      setFormData(prev => ({ ...prev, idVariedad: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.idParcela || !formData.idVariedad || !formData.fechaSiembra || !formData.areaSembradaHa) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    try {
      setLoading(true)

      const siembraData = {
        parcela: { idParcela: parseInt(formData.idParcela) },
        variedad: { idVariedad: parseInt(formData.idVariedad) },
        usuario: { idUsuario: 2 }, // Usuario por defecto
        fechaSiembra: formData.fechaSiembra,
        areaSembradaHa: parseFloat(formData.areaSembradaHa),
        densidadPlantasHa: formData.densidadPlantasHa ? parseInt(formData.densidadPlantasHa) : null,
        estado: siembra ? siembra.estado : 'en_curso',
        notas: formData.notas || null
      }

      // Si estamos editando, incluir el código de campaña existente
      if (siembra && siembra.codigoCampana) {
        siembraData.codigoCampana = siembra.codigoCampana
      }

      if (siembra) {
        await siembraService.update(siembra.idSiembra, siembraData)
        toast.success('Siembra actualizada correctamente')
      } else {
        await siembraService.create(siembraData)
        toast.success('Siembra registrada correctamente')
      }

      onSuccess()
    } catch (error) {
      console.error('Error al guardar siembra:', error)
      toast.error('Error al guardar la siembra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {siembra ? 'Editar Siembra' : 'Nueva Siembra'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mostrar código si existe (solo en modo edición) */}
          {siembra?.codigoCampana && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-blue-900 uppercase mb-1">Código de Campaña</p>
              <p className="text-sm text-blue-700 font-mono">{siembra.codigoCampana}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Parcela */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Parcela *
              </label>
              <select 
                name="idParcela"
                value={formData.idParcela}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="">Seleccionar parcela</option>
                {parcelas.map((parcela) => (
                  <option key={parcela.idParcela} value={parcela.idParcela}>
                    {parcela.nombreParcela} ({parcela.areaHectareas} ha)
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Siembra */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Fecha de Siembra *
              </label>
              <input 
                type="date" 
                name="fechaSiembra"
                value={formData.fechaSiembra}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Cultivo */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Cultivo *
              </label>
              <select 
                name="idCultivo"
                value={formData.idCultivo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="">Seleccionar cultivo</option>
                {cultivos.map((cultivo) => (
                  <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                    {cultivo.nombreComun}
                  </option>
                ))}
              </select>
            </div>

            {/* Variedad */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Variedad *
              </label>
              <select 
                name="idVariedad"
                value={formData.idVariedad}
                onChange={handleChange}
                disabled={!formData.idCultivo}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Seleccionar variedad</option>
                {variedadesFiltradas.map((variedad) => (
                  <option key={variedad.idVariedad} value={variedad.idVariedad}>
                    {variedad.nombreVariedad}
                  </option>
                ))}
              </select>
            </div>

            {/* Área Sembrada */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Área Sembrada (ha) *
              </label>
              <input 
                type="number" 
                name="areaSembradaHa"
                value={formData.areaSembradaHa}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Densidad */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Densidad (plantas/ha)
              </label>
              <input 
                type="number" 
                name="densidadPlantasHa"
                value={formData.densidadPlantasHa}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Notas */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Notas
              </label>
              <textarea 
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
                placeholder="Observaciones adicionales..."
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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {siembra ? 'Actualizar' : 'Registrar'} Siembra
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SiembraForm
