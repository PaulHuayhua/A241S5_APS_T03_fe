import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Loader2, Sprout, Leaf, Sparkles, RotateCcw, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { cultivoService, variedadService, groqService } from '../services'

export default function Catalogos() {
  const [activeTab, setActiveTab] = useState('cultivos')
  const [cultivos, setCultivos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState({
    tipoCultivo: 'todos',
    estado: '',
    cultivoVariedad: 'todos',
    resistenciaSequia: false,
    resistenciaHelada: false,
    estadoVariedad: ''
  })
  
  // Modales
  const [showModalCultivo, setShowModalCultivo] = useState(false)
  const [showModalVariedad, setShowModalVariedad] = useState(false)
  const [showModalEditCultivo, setShowModalEditCultivo] = useState(false)
  const [showModalEditVariedad, setShowModalEditVariedad] = useState(false)
  const [showModalDeleteCultivo, setShowModalDeleteCultivo] = useState(false)
  const [showModalDeleteVariedad, setShowModalDeleteVariedad] = useState(false)
  const [cultivoToEdit, setCultivoToEdit] = useState(null)
  const [cultivoToDelete, setCultivoToDelete] = useState(null)
  const [variedadToEdit, setVariedadToEdit] = useState(null)
  const [variedadToDelete, setVariedadToDelete] = useState(null)
  
  // Formularios
  const [formCultivo, setFormCultivo] = useState({
    nombreComun: '',
    nombreCientifico: '',
    tipoCultivo: '',
    cicloDiasPromedio: '',
    tempOptimaMinC: '',
    tempOptimaMaxC: '',
    precipitacionMinMm: '',
    precipitacionMaxMm: ''
  })
  
  const [formVariedad, setFormVariedad] = useState({
    idCultivo: '',
    nombreVariedad: '',
    codigo: '',
    cicloDias: '',
    rendimientoReferenciaTonHa: '',
    resistenciaSequia: false,
    resistenciaHelada: false,
    caracteristicas: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cultivosRes, variedadesRes] = await Promise.all([
        cultivoService.getAll(),
        variedadService.getAll()
      ])
      setCultivos(cultivosRes)
      setVariedades(variedadesRes)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los catálogos')
    } finally {
      setLoading(false)
    }
  }

  const handleAutocompletarCultivo = async () => {
    if (!formCultivo.nombreComun || formCultivo.nombreComun.trim().length < 2) {
      toast.error('Ingresa el nombre del cultivo primero')
      return
    }

    try {
      setLoadingAI(true)
      const loadingToast = toast.loading('🤖 Consultando IA...')
      
      const datos = await groqService.autocompletarCultivo(formCultivo.nombreComun)
      
      // Autocompletar solo los campos vacíos
      setFormCultivo(prev => ({
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
      toast.error('Error al consultar IA. Verifica tu conexión.')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleAutocompletarVariedad = async () => {
    if (!formVariedad.idCultivo || !formVariedad.nombreVariedad || formVariedad.nombreVariedad.trim().length < 2) {
      toast.error('Selecciona el cultivo e ingresa el nombre de la variedad')
      return
    }

    try {
      setLoadingAI(true)
      const loadingToast = toast.loading('🤖 Consultando IA...')
      
      const cultivoSeleccionado = cultivos.find(c => c.idCultivo === parseInt(formVariedad.idCultivo))
      const datos = await groqService.autocompletarVariedad(
        cultivoSeleccionado.nombreComun,
        formVariedad.nombreVariedad
      )
      
      // Autocompletar solo los campos vacíos
      setFormVariedad(prev => ({
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
      toast.error('Error al consultar IA. Verifica tu conexión.')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleCreateCultivo = async () => {
    if (!formCultivo.nombreComun || !formCultivo.tipoCultivo) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      await cultivoService.create({
        nombreComun: formCultivo.nombreComun,
        nombreCientifico: formCultivo.nombreCientifico || null,
        tipoCultivo: formCultivo.tipoCultivo,
        cicloDiasPromedio: formCultivo.cicloDiasPromedio ? parseInt(formCultivo.cicloDiasPromedio) : null,
        tempOptimaMinC: formCultivo.tempOptimaMinC ? parseFloat(formCultivo.tempOptimaMinC) : null,
        tempOptimaMaxC: formCultivo.tempOptimaMaxC ? parseFloat(formCultivo.tempOptimaMaxC) : null,
        precipitacionMinMm: formCultivo.precipitacionMinMm ? parseFloat(formCultivo.precipitacionMinMm) : null,
        precipitacionMaxMm: formCultivo.precipitacionMaxMm ? parseFloat(formCultivo.precipitacionMaxMm) : null,
        activo: true
      })
      
      toast.success('Cultivo creado correctamente')
      setShowModalCultivo(false)
      setFormCultivo({
        nombreComun: '',
        nombreCientifico: '',
        tipoCultivo: '',
        cicloDiasPromedio: '',
        tempOptimaMinC: '',
        tempOptimaMaxC: '',
        precipitacionMinMm: '',
        precipitacionMaxMm: ''
      })
      loadData()
    } catch (error) {
      console.error('Error al crear cultivo:', error)
      toast.error('Error al crear el cultivo')
    }
  }

  const handleCreateVariedad = async () => {
    if (!formVariedad.idCultivo || !formVariedad.nombreVariedad) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      await variedadService.create({
        cultivo: { idCultivo: parseInt(formVariedad.idCultivo) },
        nombreVariedad: formVariedad.nombreVariedad,
        codigo: formVariedad.codigo || null,
        cicloDias: formVariedad.cicloDias ? parseInt(formVariedad.cicloDias) : null,
        rendimientoReferenciaTonHa: formVariedad.rendimientoReferenciaTonHa ? parseFloat(formVariedad.rendimientoReferenciaTonHa) : null,
        resistenciaSequia: formVariedad.resistenciaSequia,
        resistenciaHelada: formVariedad.resistenciaHelada,
        caracteristicas: formVariedad.caracteristicas || null,
        activo: true
      })
      
      toast.success('Variedad creada correctamente')
      setShowModalVariedad(false)
      setFormVariedad({
        idCultivo: '',
        nombreVariedad: '',
        codigo: '',
        cicloDias: '',
        rendimientoReferenciaTonHa: '',
        resistenciaSequia: false,
        resistenciaHelada: false,
        caracteristicas: ''
      })
      loadData()
    } catch (error) {
      console.error('Error al crear variedad:', error)
      toast.error('Error al crear la variedad')
    }
  }

  const handleDeleteCultivo = async (id) => {
    try {
      const cultivo = cultivos.find(c => c.idCultivo === id)
      const cultivoActualizado = {
        ...cultivo,
        activo: false
      }
      await cultivoService.update(id, cultivoActualizado)
      toast.success('Cultivo desactivado correctamente')
      setShowModalDeleteCultivo(false)
      setCultivoToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al desactivar cultivo:', error)
      toast.error('Error al desactivar el cultivo')
    }
  }

  const handleRestoreCultivo = async (id) => {
    try {
      const cultivo = cultivos.find(c => c.idCultivo === id)
      const cultivoActualizado = {
        ...cultivo,
        activo: true
      }
      await cultivoService.update(id, cultivoActualizado)
      toast.success('Cultivo restaurado correctamente')
      loadData()
    } catch (error) {
      console.error('Error al restaurar cultivo:', error)
      toast.error('Error al restaurar el cultivo')
    }
  }

  const handleEditCultivo = (cultivo) => {
    setCultivoToEdit(cultivo)
    setFormCultivo({
      nombreComun: cultivo.nombreComun,
      nombreCientifico: cultivo.nombreCientifico || '',
      tipoCultivo: cultivo.tipoCultivo,
      cicloDiasPromedio: cultivo.cicloDiasPromedio?.toString() || '',
      tempOptimaMinC: cultivo.tempOptimaMinC?.toString() || '',
      tempOptimaMaxC: cultivo.tempOptimaMaxC?.toString() || '',
      precipitacionMinMm: cultivo.precipitacionMinMm?.toString() || '',
      precipitacionMaxMm: cultivo.precipitacionMaxMm?.toString() || ''
    })
    setShowModalEditCultivo(true)
  }

  const handleUpdateCultivo = async () => {
    if (!formCultivo.nombreComun || !formCultivo.tipoCultivo) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      await cultivoService.update(cultivoToEdit.idCultivo, {
        nombreComun: formCultivo.nombreComun,
        nombreCientifico: formCultivo.nombreCientifico || null,
        tipoCultivo: formCultivo.tipoCultivo,
        cicloDiasPromedio: formCultivo.cicloDiasPromedio ? parseInt(formCultivo.cicloDiasPromedio) : null,
        tempOptimaMinC: formCultivo.tempOptimaMinC ? parseFloat(formCultivo.tempOptimaMinC) : null,
        tempOptimaMaxC: formCultivo.tempOptimaMaxC ? parseFloat(formCultivo.tempOptimaMaxC) : null,
        precipitacionMinMm: formCultivo.precipitacionMinMm ? parseFloat(formCultivo.precipitacionMinMm) : null,
        precipitacionMaxMm: formCultivo.precipitacionMaxMm ? parseFloat(formCultivo.precipitacionMaxMm) : null,
        activo: cultivoToEdit.activo
      })
      
      toast.success('Cultivo actualizado correctamente')
      setShowModalEditCultivo(false)
      setCultivoToEdit(null)
      setFormCultivo({
        nombreComun: '',
        nombreCientifico: '',
        tipoCultivo: '',
        cicloDiasPromedio: '',
        tempOptimaMinC: '',
        tempOptimaMaxC: '',
        precipitacionMinMm: '',
        precipitacionMaxMm: ''
      })
      loadData()
    } catch (error) {
      console.error('Error al actualizar cultivo:', error)
      toast.error('Error al actualizar el cultivo')
    }
  }

  const handleDeleteVariedad = async (id) => {
    try {
      const variedad = variedades.find(v => v.idVariedad === id)
      const variedadActualizada = {
        ...variedad,
        activo: false
      }
      await variedadService.update(id, variedadActualizada)
      toast.success('Variedad desactivada correctamente')
      setShowModalDeleteVariedad(false)
      setVariedadToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al desactivar variedad:', error)
      toast.error('Error al desactivar la variedad')
    }
  }

  const handleRestoreVariedad = async (id) => {
    try {
      const variedad = variedades.find(v => v.idVariedad === id)
      const variedadActualizada = {
        ...variedad,
        activo: true
      }
      await variedadService.update(id, variedadActualizada)
      toast.success('Variedad restaurada correctamente')
      loadData()
    } catch (error) {
      console.error('Error al restaurar variedad:', error)
      toast.error('Error al restaurar la variedad')
    }
  }

  const handleEditVariedad = (variedad) => {
    setVariedadToEdit(variedad)
    setFormVariedad({
      idCultivo: variedad.cultivo?.idCultivo?.toString() || '',
      nombreVariedad: variedad.nombreVariedad,
      codigo: variedad.codigo || '',
      cicloDias: variedad.cicloDias?.toString() || '',
      rendimientoReferenciaTonHa: variedad.rendimientoReferenciaTonHa?.toString() || '',
      resistenciaSequia: variedad.resistenciaSequia || false,
      resistenciaHelada: variedad.resistenciaHelada || false,
      caracteristicas: variedad.caracteristicas || ''
    })
    setShowModalEditVariedad(true)
  }

  const handleUpdateVariedad = async () => {
    if (!formVariedad.idCultivo || !formVariedad.nombreVariedad) {
      toast.error('Complete los campos obligatorios')
      return
    }

    try {
      await variedadService.update(variedadToEdit.idVariedad, {
        cultivo: { idCultivo: parseInt(formVariedad.idCultivo) },
        nombreVariedad: formVariedad.nombreVariedad,
        codigo: formVariedad.codigo || null,
        cicloDias: formVariedad.cicloDias ? parseInt(formVariedad.cicloDias) : null,
        rendimientoReferenciaTonHa: formVariedad.rendimientoReferenciaTonHa ? parseFloat(formVariedad.rendimientoReferenciaTonHa) : null,
        resistenciaSequia: formVariedad.resistenciaSequia,
        resistenciaHelada: formVariedad.resistenciaHelada,
        caracteristicas: formVariedad.caracteristicas || null,
        activo: variedadToEdit.activo
      })
      
      toast.success('Variedad actualizada correctamente')
      setShowModalEditVariedad(false)
      setVariedadToEdit(null)
      setFormVariedad({
        idCultivo: '',
        nombreVariedad: '',
        codigo: '',
        cicloDias: '',
        rendimientoReferenciaTonHa: '',
        resistenciaSequia: false,
        resistenciaHelada: false,
        caracteristicas: ''
      })
      loadData()
    } catch (error) {
      console.error('Error al actualizar variedad:', error)
      toast.error('Error al actualizar la variedad')
    }
  }

  const clearFilters = () => {
    setFilters({ 
      tipoCultivo: 'todos', 
      estado: '', 
      cultivoVariedad: 'todos',
      resistenciaSequia: false,
      resistenciaHelada: false,
      estadoVariedad: ''
    })
  }

  // Filtrar cultivos
  const filteredCultivos = cultivos.filter(cultivo => {
    const tipoMatch = filters.tipoCultivo === 'todos' || cultivo.tipoCultivo === filters.tipoCultivo
    const estadoMatch = !filters.estado || 
      (filters.estado === 'activo' && cultivo.activo) ||
      (filters.estado === 'inactivo' && !cultivo.activo)
    
    return tipoMatch && estadoMatch
  })

  // Filtrar variedades
  const filteredVariedades = variedades.filter(variedad => {
    const cultivoMatch = filters.cultivoVariedad === 'todos' || 
      variedad.cultivo?.idCultivo === parseInt(filters.cultivoVariedad)
    const sequiaMatch = !filters.resistenciaSequia || variedad.resistenciaSequia
    const heladaMatch = !filters.resistenciaHelada || variedad.resistenciaHelada
    const estadoMatch = !filters.estadoVariedad || 
      (filters.estadoVariedad === 'activo' && variedad.activo) ||
      (filters.estadoVariedad === 'inactivo' && !variedad.activo)
    
    return cultivoMatch && sequiaMatch && heladaMatch && estadoMatch
  })

  // Calcular estadísticas
  const stats = {
    totalCultivos: cultivos.length,
    cultivosActivos: cultivos.filter(c => c.activo).length,
    totalVariedades: variedades.length,
    variedadesActivas: variedades.filter(v => v.activo).length,
    tiposCultivo: [...new Set(cultivos.map(c => c.tipoCultivo))].length
  }

  // Obtener tipos de cultivo únicos
  const tiposCultivoUnicos = [...new Set(cultivos.map(c => c.tipoCultivo))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando catálogos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de cultivos y variedades</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Cultivos</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.totalCultivos}</p>
              <p className="text-sm text-gray-500 mt-2">Registrados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cultivos Activos</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.cultivosActivos}</p>
              <p className="text-sm text-gray-500 mt-2">En uso</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Variedades</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.totalVariedades}</p>
              <p className="text-sm text-gray-500 mt-2">Disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tipos de Cultivo</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.tiposCultivo}</p>
              <p className="text-sm text-gray-500 mt-2">Categorías</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('cultivos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cultivos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Cultivos ({cultivos.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('variedades')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'variedades'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Variedades ({variedades.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'cultivos' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-5 border border-gray-200 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filtros</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-6">
                {/* Tipo de Cultivo */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Tipo de Cultivo</h4>
                  <select 
                    value={filters.tipoCultivo}
                    onChange={(e) => setFilters({ ...filters, tipoCultivo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                  >
                    <option value="todos">Todos los tipos</option>
                    {tiposCultivoUnicos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'activo', label: 'Activos', count: stats.cultivosActivos },
                      { value: 'inactivo', label: 'Inactivos', count: stats.totalCultivos - stats.cultivosActivos }
                    ].map((estado) => (
                      <button
                        key={estado.value}
                        onClick={() => setFilters({ ...filters, estado: filters.estado === estado.value ? '' : estado.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                          filters.estado === estado.value
                            ? 'bg-primary-50 border-primary-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-gray-700">{estado.label}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          filters.estado === estado.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {estado.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Cultivos Registrados</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredCultivos.length === cultivos.length 
                        ? `${cultivos.length} cultivos en total`
                        : `${filteredCultivos.length} de ${cultivos.length} cultivos`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(filters.tipoCultivo !== 'todos' || filters.estado) && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        Filtros aplicados
                      </span>
                    )}
                    <button
                      onClick={() => setShowModalCultivo(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Cultivo
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ciclo</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Temp. Óptima</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</span>
                      </th>
                      <th className="px-6 py-3 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCultivos.length > 0 ? (
                      filteredCultivos.map((cultivo) => (
                        <tr key={cultivo.idCultivo} className={`bg-white ${!cultivo.activo ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{cultivo.nombreComun}</p>
                              <p className="text-xs text-gray-500 italic">{cultivo.nombreCientifico || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase bg-green-100 text-green-700">
                              {cultivo.tipoCultivo}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{cultivo.cicloDiasPromedio || 'N/A'} días</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">
                              {cultivo.tempOptimaMinC && cultivo.tempOptimaMaxC 
                                ? `${cultivo.tempOptimaMinC}°C - ${cultivo.tempOptimaMaxC}°C`
                                : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                              cultivo.activo 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {cultivo.activo ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {cultivo.activo ? (
                                <>
                                  <button
                                    onClick={() => handleEditCultivo(cultivo)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Editar"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCultivoToDelete(cultivo)
                                      setShowModalDeleteCultivo(true)
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestoreCultivo(cultivo.idCultivo)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Restaurar"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-16">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Leaf className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-900 font-semibold mb-1">No se encontraron resultados</p>
                            <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
                            <button 
                              onClick={clearFilters}
                              className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-300 rounded-lg hover:bg-primary-50 transition-all"
                            >
                              Limpiar filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'variedades' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-5 border border-gray-200 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filtros</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-6">
                {/* Cultivo */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Cultivo</h4>
                  <select 
                    value={filters.cultivoVariedad}
                    onChange={(e) => setFilters({ ...filters, cultivoVariedad: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                  >
                    <option value="todos">Todos los cultivos</option>
                    {cultivos.filter(c => c.activo).map((cultivo) => (
                      <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                        {cultivo.nombreComun}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resistencias */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Resistencias</h4>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.resistenciaSequia}
                        onChange={(e) => setFilters({ ...filters, resistenciaSequia: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Resistente a sequía</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.resistenciaHelada}
                        onChange={(e) => setFilters({ ...filters, resistenciaHelada: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Resistente a heladas</span>
                    </label>
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'activo', label: 'Activas', count: stats.variedadesActivas },
                      { value: 'inactivo', label: 'Inactivas', count: stats.totalVariedades - stats.variedadesActivas }
                    ].map((estado) => (
                      <button
                        key={estado.value}
                        onClick={() => setFilters({ ...filters, estadoVariedad: filters.estadoVariedad === estado.value ? '' : estado.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                          filters.estadoVariedad === estado.value
                            ? 'bg-primary-50 border-primary-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-gray-700">{estado.label}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          filters.estadoVariedad === estado.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {estado.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Variedades Registradas</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {filteredVariedades.length === variedades.length 
                        ? `${variedades.length} variedades en total`
                        : `${filteredVariedades.length} de ${variedades.length} variedades`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(filters.cultivoVariedad !== 'todos' || filters.resistenciaSequia || filters.resistenciaHelada || filters.estadoVariedad) && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        Filtros aplicados
                      </span>
                    )}
                    <button
                      onClick={() => setShowModalVariedad(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Variedad
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Variedad</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Código</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ciclo</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rendimiento</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Resistencias</span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</span>
                      </th>
                      <th className="px-6 py-3 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVariedades.length > 0 ? (
                      filteredVariedades.map((variedad) => (
                        <tr key={variedad.idVariedad} className={`bg-white ${!variedad.activo ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">{variedad.nombreVariedad}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{variedad.cultivo?.nombreComun}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">{variedad.codigo || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{variedad.cicloDias || 'N/A'} días</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{variedad.rendimientoReferenciaTonHa || 'N/A'} ton/ha</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {variedad.resistenciaSequia && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700" title="Resistente a sequía">
                                  Sequía
                                </span>
                              )}
                              {variedad.resistenciaHelada && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700" title="Resistente a heladas">
                                  Helada
                                </span>
                              )}
                              {!variedad.resistenciaSequia && !variedad.resistenciaHelada && (
                                <span className="text-sm text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                              variedad.activo 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {variedad.activo ? 'ACTIVA' : 'INACTIVA'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {variedad.activo ? (
                                <>
                                  <button
                                    onClick={() => handleEditVariedad(variedad)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Editar"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setVariedadToDelete(variedad)
                                      setShowModalDeleteVariedad(true)
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Desactivar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestoreVariedad(variedad.idVariedad)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Restaurar"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-16">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Sprout className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-900 font-semibold mb-1">No se encontraron resultados</p>
                            <p className="text-sm text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
                            <button 
                              onClick={clearFilters}
                              className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-300 rounded-lg hover:bg-primary-50 transition-all"
                            >
                              Limpiar filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Modales */}
      {/* Modal Nuevo Cultivo */}
      {showModalCultivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Cultivo</h3>
              <button onClick={() => setShowModalCultivo(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Botón de Autocompletar con IA */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Autocompletar con IA</h4>
                      <p className="text-sm text-gray-600">Completa automáticamente los datos técnicos del cultivo</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAutocompletarCultivo}
                    disabled={loadingAI || !formCultivo.nombreComun}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Común *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Maíz"
                    value={formCultivo.nombreComun}
                    onChange={(e) => setFormCultivo({ ...formCultivo, nombreComun: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Científico</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Zea mays"
                    value={formCultivo.nombreCientifico}
                    onChange={(e) => setFormCultivo({ ...formCultivo, nombreCientifico: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Tipo de Cultivo *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formCultivo.tipoCultivo}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tipoCultivo: e.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Cereal">Cereal</option>
                    <option value="Tubérculo">Tubérculo</option>
                    <option value="Leguminosa">Leguminosa</option>
                    <option value="Hortaliza">Hortaliza</option>
                    <option value="Fruta">Fruta</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Ciclo (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="120"
                    value={formCultivo.cicloDiasPromedio}
                    onChange={(e) => setFormCultivo({ ...formCultivo, cicloDiasPromedio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Temp. Mín. (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="18"
                    value={formCultivo.tempOptimaMinC}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tempOptimaMinC: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Temp. Máx. (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="30"
                    value={formCultivo.tempOptimaMaxC}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tempOptimaMaxC: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Precip. Mín. (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="400"
                    value={formCultivo.precipitacionMinMm}
                    onChange={(e) => setFormCultivo({ ...formCultivo, precipitacionMinMm: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Precip. Máx. (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="800"
                    value={formCultivo.precipitacionMaxMm}
                    onChange={(e) => setFormCultivo({ ...formCultivo, precipitacionMaxMm: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowModalCultivo(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleCreateCultivo} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Crear Cultivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Variedad */}
      {showModalVariedad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Variedad</h3>
              <button onClick={() => setShowModalVariedad(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Botón de Autocompletar con IA */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Autocompletar con IA</h4>
                      <p className="text-sm text-gray-600">Completa automáticamente los datos técnicos de la variedad</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAutocompletarVariedad}
                    disabled={loadingAI || !formVariedad.idCultivo || !formVariedad.nombreVariedad}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Cultivo *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formVariedad.idCultivo}
                    onChange={(e) => setFormVariedad({ ...formVariedad, idCultivo: e.target.value })}
                  >
                    <option value="">Seleccionar cultivo</option>
                    {cultivos.map((cultivo) => (
                      <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                        {cultivo.nombreComun}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Variedad *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Amarillo Duro"
                    value={formVariedad.nombreVariedad}
                    onChange={(e) => setFormVariedad({ ...formVariedad, nombreVariedad: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="MAD-001"
                    value={formVariedad.codigo}
                    onChange={(e) => setFormVariedad({ ...formVariedad, codigo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Ciclo (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="120"
                    value={formVariedad.cicloDias}
                    onChange={(e) => setFormVariedad({ ...formVariedad, cicloDias: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Rendimiento Referencia (ton/ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="8.5"
                    value={formVariedad.rendimientoReferenciaTonHa}
                    onChange={(e) => setFormVariedad({ ...formVariedad, rendimientoReferenciaTonHa: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Características</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows="3"
                    placeholder="Descripción de la variedad..."
                    value={formVariedad.caracteristicas}
                    onChange={(e) => setFormVariedad({ ...formVariedad, caracteristicas: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formVariedad.resistenciaSequia}
                      onChange={(e) => setFormVariedad({ ...formVariedad, resistenciaSequia: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Resistente a sequía</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formVariedad.resistenciaHelada}
                      onChange={(e) => setFormVariedad({ ...formVariedad, resistenciaHelada: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Resistente a heladas</span>
                  </label>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowModalVariedad(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleCreateVariedad} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Crear Variedad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cultivo */}
      {showModalEditCultivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Editar Cultivo</h3>
              <button onClick={() => {
                setShowModalEditCultivo(false)
                setCultivoToEdit(null)
              }} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Común *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Maíz"
                    value={formCultivo.nombreComun}
                    onChange={(e) => setFormCultivo({ ...formCultivo, nombreComun: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Científico</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Zea mays"
                    value={formCultivo.nombreCientifico}
                    onChange={(e) => setFormCultivo({ ...formCultivo, nombreCientifico: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Tipo de Cultivo *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formCultivo.tipoCultivo}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tipoCultivo: e.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Cereal">Cereal</option>
                    <option value="Tubérculo">Tubérculo</option>
                    <option value="Leguminosa">Leguminosa</option>
                    <option value="Hortaliza">Hortaliza</option>
                    <option value="Fruta">Fruta</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Ciclo (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="120"
                    value={formCultivo.cicloDiasPromedio}
                    onChange={(e) => setFormCultivo({ ...formCultivo, cicloDiasPromedio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Temp. Mín. (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="18"
                    value={formCultivo.tempOptimaMinC}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tempOptimaMinC: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Temp. Máx. (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="30"
                    value={formCultivo.tempOptimaMaxC}
                    onChange={(e) => setFormCultivo({ ...formCultivo, tempOptimaMaxC: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Precip. Mín. (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="400"
                    value={formCultivo.precipitacionMinMm}
                    onChange={(e) => setFormCultivo({ ...formCultivo, precipitacionMinMm: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Precip. Máx. (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="800"
                    value={formCultivo.precipitacionMaxMm}
                    onChange={(e) => setFormCultivo({ ...formCultivo, precipitacionMaxMm: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => {
                setShowModalEditCultivo(false)
                setCultivoToEdit(null)
              }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleUpdateCultivo} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {showModalDeleteCultivo && cultivoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Desactivación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas desactivar el cultivo <span className="font-semibold">{cultivoToDelete.nombreComun}</span>?
              </p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowModalDeleteCultivo(false)
                  setCultivoToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDeleteCultivo(cultivoToDelete.idCultivo)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Variedad */}
      {showModalEditVariedad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Editar Variedad</h3>
              <button onClick={() => {
                setShowModalEditVariedad(false)
                setVariedadToEdit(null)
              }} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Cultivo *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formVariedad.idCultivo}
                    onChange={(e) => setFormVariedad({ ...formVariedad, idCultivo: e.target.value })}
                  >
                    <option value="">Seleccionar cultivo</option>
                    {cultivos.map((cultivo) => (
                      <option key={cultivo.idCultivo} value={cultivo.idCultivo}>
                        {cultivo.nombreComun}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre Variedad *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: Amarillo Duro"
                    value={formVariedad.nombreVariedad}
                    onChange={(e) => setFormVariedad({ ...formVariedad, nombreVariedad: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="MAD-001"
                    value={formVariedad.codigo}
                    onChange={(e) => setFormVariedad({ ...formVariedad, codigo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Ciclo (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="120"
                    value={formVariedad.cicloDias}
                    onChange={(e) => setFormVariedad({ ...formVariedad, cicloDias: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Rendimiento Referencia (ton/ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="8.5"
                    value={formVariedad.rendimientoReferenciaTonHa}
                    onChange={(e) => setFormVariedad({ ...formVariedad, rendimientoReferenciaTonHa: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Características</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows="3"
                    placeholder="Descripción de la variedad..."
                    value={formVariedad.caracteristicas}
                    onChange={(e) => setFormVariedad({ ...formVariedad, caracteristicas: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formVariedad.resistenciaSequia}
                      onChange={(e) => setFormVariedad({ ...formVariedad, resistenciaSequia: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Resistente a sequía</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formVariedad.resistenciaHelada}
                      onChange={(e) => setFormVariedad({ ...formVariedad, resistenciaHelada: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Resistente a heladas</span>
                  </label>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => {
                setShowModalEditVariedad(false)
                setVariedadToEdit(null)
              }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleUpdateVariedad} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación Variedad */}
      {showModalDeleteVariedad && variedadToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Desactivación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas desactivar la variedad <span className="font-semibold">{variedadToDelete.nombreVariedad}</span>?
              </p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowModalDeleteVariedad(false)
                  setVariedadToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDeleteVariedad(variedadToDelete.idVariedad)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
