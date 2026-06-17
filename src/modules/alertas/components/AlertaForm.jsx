import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import geografiaService from '../../../shared/services/geografia.service'

export default function AlertaForm({ alerta, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    region: null,
    tipoEvento: '',
    nivelRiesgo: 'MEDIO',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    activa: true
  })

  const [regiones, setRegiones] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [selectedDepartamento, setSelectedDepartamento] = useState('')

  useEffect(() => {
    cargarDepartamentos()
  }, [])

  useEffect(() => {
    if (alerta) {
      setFormData({
        region: alerta.region,
        tipoEvento: alerta.tipoEvento || '',
        nivelRiesgo: (alerta.nivelRiesgo || 'MEDIO').toUpperCase(),
        fechaInicio: alerta.fechaInicio || '',
        fechaFin: alerta.fechaFin || '',
        descripcion: alerta.descripcion || '',
        activa: alerta.activa ?? true
      })
      if (alerta.region?.departamento?.idDepartamento) {
        setSelectedDepartamento(alerta.region.departamento.idDepartamento)
        cargarRegiones(alerta.region.departamento.idDepartamento)
      }
    }
  }, [alerta])

  const cargarDepartamentos = async () => {
    try {
      const data = await geografiaService.getDepartamentos()
      setDepartamentos(data)
    } catch (error) {
      console.error('Error al cargar departamentos:', error)
      toast.error('Error al cargar departamentos')
    }
  }

  const cargarRegiones = async (idDepartamento) => {
    try {
      const data = await geografiaService.getRegionesByDepartamento(idDepartamento)
      setRegiones(data)
    } catch (error) {
      console.error('Error al cargar regiones:', error)
      toast.error('Error al cargar regiones')
    }
  }

  const handleDepartamentoChange = (e) => {
    const idDepartamento = e.target.value
    setSelectedDepartamento(idDepartamento)
    setFormData({ ...formData, region: null })
    if (idDepartamento) {
      cargarRegiones(idDepartamento)
    } else {
      setRegiones([])
    }
  }

  const handleRegionChange = (e) => {
    const idRegion = parseInt(e.target.value)
    const region = regiones.find(r => r.idRegion === idRegion)
    setFormData({ ...formData, region })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.region) {
      toast.error('Debe seleccionar una región')
      return
    }
    if (!formData.tipoEvento.trim()) {
      toast.error('Debe ingresar el tipo de evento')
      return
    }
    if (!formData.fechaInicio) {
      toast.error('Debe ingresar la fecha de inicio')
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {alerta ? 'Editar Alerta' : 'Nueva Alerta Climática'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Departamento y Región */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDepartamento}
                onChange={handleDepartamentoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Seleccione departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.idDepartamento} value={dep.idDepartamento}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.region?.idRegion || ''}
                onChange={handleRegionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
                disabled={!selectedDepartamento}
              >
                <option value="">Seleccione región</option>
                {regiones.map(reg => (
                  <option key={reg.idRegion} value={reg.idRegion}>
                    {reg.nombre} - {reg.provincia}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipo de Evento y Nivel de Riesgo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipoEvento}
                onChange={(e) => setFormData({ ...formData, tipoEvento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Seleccione tipo</option>
                <option value="Sequía">Sequía</option>
                <option value="Helada">Helada</option>
                <option value="Inundación">Inundación</option>
                <option value="Granizada">Granizada</option>
                <option value="Vientos fuertes">Vientos fuertes</option>
                <option value="Ola de calor">Ola de calor</option>
                <option value="Tormenta eléctrica">Tormenta eléctrica</option>
                <option value="Nevada">Nevada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Riesgo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nivelRiesgo}
                onChange={(e) => setFormData({ ...formData, nivelRiesgo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="BAJO">🟢 Bajo</option>
                <option value="MEDIO">🟡 Medio</option>
                <option value="ALTO">🟠 Alto</option>
                <option value="CRITICO">🔴 Crítico</option>
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin (Estimada)
              </label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Detalles adicionales de la alerta..."
            />
          </div>

          {/* Estado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activa"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="activa" className="text-sm text-gray-700">
              Alerta activa
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {alerta ? 'Actualizar' : 'Crear'} Alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
