import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parcelaService } from '../services/parcela.service'
import { departamentoService, regionService } from '../../../shared/services/geografia.service'
import { sueloService } from '../../../shared/services/suelo.service'

const sistemasRiegoOptions = [
  { value: 'goteo', label: 'Goteo' },
  { value: 'aspersion', label: 'Aspersión' },
  { value: 'gravedad', label: 'Gravedad' },
  { value: 'pivot', label: 'Pivot' },
  { value: 'ninguno', label: 'Ninguno' },
]

const ParcelaForm = ({ parcela, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [departamentos, setDepartamentos] = useState([])
  const [regiones, setRegiones] = useState([])
  const [tiposSuelo, setTiposSuelo] = useState([])
  const [regionesFiltradas, setRegionesFiltradas] = useState([])
  
  const [formData, setFormData] = useState({
    nombreParcela: '',
    idDepartamento: '',
    idRegion: '',
    idTipoSuelo: '',
    sistemaRiego: 'goteo',
    areaHectareas: '',
    phSuelo: '',
    materiaOrganicaPct: ''
  })

  useEffect(() => {
    loadCatalogos()
  }, [])

  useEffect(() => {
    if (parcela) {
      setFormData({
        nombreParcela: parcela.nombreParcela || '',
        idDepartamento: parcela.region?.departamento?.idDepartamento || '',
        idRegion: parcela.region?.idRegion || '',
        idTipoSuelo: parcela.tipoSuelo?.idTipoSuelo || '',
        sistemaRiego: parcela.sistemaRiego || 'goteo',
        areaHectareas: parcela.areaHectareas || '',
        phSuelo: parcela.phSuelo || '',
        materiaOrganicaPct: parcela.materiaOrganicaPct || ''
      })
    }
  }, [parcela])

  useEffect(() => {
    if (formData.idDepartamento) {
      const filtered = regiones.filter(r => r.departamento?.idDepartamento === parseInt(formData.idDepartamento))
      setRegionesFiltradas(filtered)
    } else {
      setRegionesFiltradas(regiones)
    }
  }, [formData.idDepartamento, regiones])

  const loadCatalogos = async () => {
    try {
      const [deptosRes, regionesRes, suelosRes] = await Promise.all([
        departamentoService.getAll(),
        regionService.getAll(),
        sueloService.getAll()
      ])
      setDepartamentos(deptosRes)
      setRegiones(regionesRes)
      setTiposSuelo(suelosRes)
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
    
    // Limpiar región cuando cambie el departamento
    if (name === 'idDepartamento') {
      setFormData(prev => ({ ...prev, idRegion: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nombreParcela || !formData.idRegion || !formData.idTipoSuelo || !formData.areaHectareas) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    try {
      setLoading(true)

      const parcelaData = {
        nombreParcela: formData.nombreParcela,
        region: { idRegion: parseInt(formData.idRegion) },
        tipoSuelo: { idTipoSuelo: parseInt(formData.idTipoSuelo) },
        usuario: { idUsuario: 2 }, // Usuario por defecto
        sistemaRiego: formData.sistemaRiego,
        areaHectareas: parseFloat(formData.areaHectareas),
        phSuelo: formData.phSuelo ? parseFloat(formData.phSuelo) : null,
        materiaOrganicaPct: formData.materiaOrganicaPct ? parseFloat(formData.materiaOrganicaPct) : null,
        activo: parcela ? parcela.activo : true
      }

      // Si estamos editando, incluir el código catastral existente
      if (parcela && parcela.codigoCatastral) {
        parcelaData.codigoCatastral = parcela.codigoCatastral
      }

      if (parcela) {
        await parcelaService.update(parcela.idParcela, parcelaData)
        toast.success('Parcela actualizada correctamente')
      } else {
        await parcelaService.create(parcelaData)
        toast.success('Parcela creada correctamente')
      }

      onSuccess()
    } catch (error) {
      console.error('Error al guardar parcela:', error)
      toast.error('Error al guardar la parcela')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {parcela ? 'Editar Parcela' : 'Crear Nueva Parcela'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mostrar código si existe (solo en modo edición) */}
          {parcela?.codigoCatastral && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-blue-900 uppercase mb-1">Código Catastral</p>
              <p className="text-sm text-blue-700 font-mono">{parcela.codigoCatastral}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Nombre de la Parcela */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Nombre de la Parcela *
              </label>
              <input 
                type="text" 
                name="nombreParcela"
                value={formData.nombreParcela}
                onChange={handleChange}
                placeholder="Ej: El Dorado"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Departamento */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Departamento *
              </label>
              <select 
                name="idDepartamento"
                value={formData.idDepartamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="">Seleccionar departamento</option>
                {departamentos.map((depto) => (
                  <option key={depto.idDepartamento} value={depto.idDepartamento}>
                    {depto.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Región */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Región *
              </label>
              <select 
                name="idRegion"
                value={formData.idRegion}
                onChange={handleChange}
                disabled={!formData.idDepartamento}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Seleccionar región</option>
                {regionesFiltradas.map((region) => (
                  <option key={region.idRegion} value={region.idRegion}>
                    {region.nombre} ({region.provincia})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Suelo */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Tipo de Suelo *
              </label>
              <select 
                name="idTipoSuelo"
                value={formData.idTipoSuelo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="">Seleccionar tipo de suelo</option>
                {tiposSuelo.map((tipo) => (
                  <option key={tipo.idTipoSuelo} value={tipo.idTipoSuelo}>
                    {tipo.nombre} ({tipo.clasificacion})
                  </option>
                ))}
              </select>
            </div>

            {/* Sistema de Riego */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Sistema de Riego *
              </label>
              <select 
                name="sistemaRiego"
                value={formData.sistemaRiego}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                {sistemasRiegoOptions.map((sistema) => (
                  <option key={sistema.value} value={sistema.value}>
                    {sistema.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Área */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Área (hectáreas) *
              </label>
              <input 
                type="number" 
                name="areaHectareas"
                value={formData.areaHectareas}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* pH del Suelo */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                pH del Suelo
              </label>
              <input 
                type="number" 
                name="phSuelo"
                value={formData.phSuelo}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                max="14"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Materia Orgánica */}
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">
                Materia Orgánica (%)
              </label>
              <input 
                type="number" 
                name="materiaOrganicaPct"
                value={formData.materiaOrganicaPct}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
              {parcela ? 'Actualizar' : 'Crear'} Parcela
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ParcelaForm
