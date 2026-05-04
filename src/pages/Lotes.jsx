import { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parcelaService, departamentoService, regionService, sueloService } from '../services'

const sistemasRiegoOptions = [
  { value: 'goteo', label: 'Goteo' },
  { value: 'aspersion', label: 'Aspersión' },
  { value: 'gravedad', label: 'Gravedad' },
  { value: 'pivot', label: 'Pivot' },
  { value: 'ninguno', label: 'Ninguno' },
]

export default function Lotes() {
  // Estados para datos de la API
  const [parcelas, setParcelas] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [regiones, setRegiones] = useState([])
  const [tiposSuelo, setTiposSuelo] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para formularios
  const [selectedDepartamento, setSelectedDepartamento] = useState('')
  const [regionesFiltradas, setRegionesFiltradas] = useState([])

  const [filters, setFilters] = useState({
    departamento: [],
    tipo_suelo: 'todos',
    activo: ''
  })

  const [modalView, setModalView] = useState(null)
  const [modalEdit, setModalEdit] = useState(null)
  const [modalDelete, setModalDelete] = useState(null)
  const [modalCreate, setModalCreate] = useState(false)

  const [formData, setFormData] = useState({
    nombreParcela: '',
    codigoCatastral: '',
    idRegion: '',
    idTipoSuelo: '',
    sistemaRiego: 'goteo',
    areaHectareas: '',
    phSuelo: '',
    materiaOrganicaPct: ''
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        
        // Cargar parcelas, departamentos, regiones y tipos de suelo en paralelo
        const [parcelasRes, deptosRes, regionesRes, suelosRes] = await Promise.all([
          parcelaService.getAll(),
          departamentoService.getAll(),
          regionService.getAll(),
          sueloService.getAll()
        ])
        
        setParcelas(parcelasRes)
        setDepartamentos(deptosRes)
        setRegiones(regionesRes)
        setTiposSuelo(suelosRes)
        
        toast.success('Datos cargados correctamente')
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Filtrar regiones cuando cambia el departamento seleccionado
  useEffect(() => {
    if (selectedDepartamento) {
      const filtered = regiones.filter(r => r.departamento?.idDepartamento === parseInt(selectedDepartamento))
      setRegionesFiltradas(filtered)
    } else {
      setRegionesFiltradas(regiones)
    }
  }, [selectedDepartamento, regiones])

  const toggleDepartamento = (depto) => {
    const newDeptos = filters.departamento.includes(depto)
      ? filters.departamento.filter(d => d !== depto)
      : [...filters.departamento, depto]
    setFilters({ ...filters, departamento: newDeptos })
  }

  const clearFilters = () => {
    setFilters({ departamento: [], tipo_suelo: 'todos', activo: '' })
  }

  // Filtrar datos
  const filteredParcelas = parcelas.filter(parcela => {
    const deptoMatch = filters.departamento.length === 0 || 
      filters.departamento.includes(parcela.region?.departamento?.nombre)
    const tipoSueloMatch = filters.tipo_suelo === 'todos' || 
      parcela.tipoSuelo?.idTipoSuelo === parseInt(filters.tipo_suelo)
    const activoMatch = !filters.activo || 
      (filters.activo === 'activo' && parcela.activo) ||
      (filters.activo === 'inactivo' && !parcela.activo)
    
    return deptoMatch && tipoSueloMatch && activoMatch
  })

  const handleView = (parcela) => {
    setModalView(parcela)
  }

  const handleEdit = (parcela) => {
    setModalEdit(parcela)
  }

  const handleDelete = (parcela) => {
    setModalDelete(parcela)
  }

  const confirmDelete = async () => {
    try {
      await parcelaService.delete(modalDelete.idParcela)
      setParcelas(parcelas.filter(p => p.idParcela !== modalDelete.idParcela))
      toast.success(`Parcela ${modalDelete.nombreParcela} eliminada correctamente`)
      setModalDelete(null)
    } catch (error) {
      console.error('Error al eliminar parcela:', error)
      toast.error('Error al eliminar la parcela')
    }
  }

  const handleCreate = async () => {
    if (!formData.nombreParcela || !formData.idRegion || !formData.idTipoSuelo || !formData.areaHectareas) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    
    try {
      const nuevaParcela = await parcelaService.create({
        nombreParcela: formData.nombreParcela,
        codigoCatastral: formData.codigoCatastral,
        region: { idRegion: parseInt(formData.idRegion) },
        tipoSuelo: { idTipoSuelo: parseInt(formData.idTipoSuelo) },
        usuario: { idUsuario: 2 }, // Usuario por defecto (María González)
        sistemaRiego: formData.sistemaRiego,
        areaHectareas: parseFloat(formData.areaHectareas),
        phSuelo: formData.phSuelo ? parseFloat(formData.phSuelo) : null,
        materiaOrganicaPct: formData.materiaOrganicaPct ? parseFloat(formData.materiaOrganicaPct) : null,
        activo: true
      })
      
      setParcelas([nuevaParcela, ...parcelas])
      toast.success('Nueva parcela creada correctamente')
      setModalCreate(false)
      setFormData({
        nombreParcela: '',
        codigoCatastral: '',
        idRegion: '',
        idTipoSuelo: '',
        sistemaRiego: 'goteo',
        areaHectareas: '',
        phSuelo: '',
        materiaOrganicaPct: ''
      })
      setSelectedDepartamento('')
    } catch (error) {
      console.error('Error al crear parcela:', error)
      toast.error('Error al crear la parcela')
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h1>
          <p className="text-sm text-gray-500 mt-1">Administración de parcelas agrícolas registradas</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium" onClick={() => setModalCreate(true)}>
          <Plus className="w-4 h-4" />
          Nueva Parcela
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Área Total</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">1,200.5</p>
              <p className="text-sm text-gray-500 mt-2">Hectáreas registradas</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Parcelas Activas</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">3</p>
              <p className="text-sm text-gray-500 mt-2">En producción</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">pH Promedio</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">6.9</p>
              <p className="text-sm text-gray-500 mt-2">Calidad del suelo</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Materia Orgánica</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">3.4%</p>
              <p className="text-sm text-gray-500 mt-2">Promedio general</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
              {/* Departamento */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Departamento</h4>
                <div className="space-y-2.5">
                  {departamentos.map((depto) => (
                    <label key={depto.idDepartamento} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.departamento.includes(depto.nombre)}
                        onChange={() => toggleDepartamento(depto.nombre)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{depto.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de Suelo */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Tipo de Suelo</h4>
                <select 
                  value={filters.tipo_suelo}
                  onChange={(e) => setFilters({ ...filters, tipo_suelo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <option value="todos">Todos los tipos</option>
                  {tiposSuelo.map((tipo) => (
                    <option key={tipo.idTipoSuelo} value={tipo.idTipoSuelo}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado de Parcela */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
                <div className="space-y-2">
                  {[
                    { value: 'activo', label: 'Activas', count: parcelas.filter(p => p.activo).length },
                    { value: 'inactivo', label: 'Inactivas', count: parcelas.filter(p => !p.activo).length }
                  ].map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => setFilters({ ...filters, activo: filters.activo === estado.value ? '' : estado.value })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                        filters.activo === estado.value
                          ? 'bg-primary-50 border-primary-200 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-700">{estado.label}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        filters.activo === estado.value
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
                  <h3 className="text-base font-semibold text-gray-900">Parcelas Registradas</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {filteredParcelas.length === parcelas.length 
                      ? `${parcelas.length} parcelas en total`
                      : `${filteredParcelas.length} de ${parcelas.length} parcelas`
                    }
                  </p>
                </div>
                {(filters.departamento.length > 0 || filters.tipo_suelo !== 'todos' || filters.activo) && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    Filtros aplicados
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Código</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Parcela</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo Suelo</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Área</span>
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
                  {filteredParcelas.length > 0 ? (
                    filteredParcelas.map((parcela) => (
                      <tr key={parcela.idParcela} className="bg-white">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {parcela.codigoCatastral || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{parcela.nombreParcela}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {parcela.region?.nombre} - {parcela.region?.provincia}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{parcela.tipoSuelo?.nombre}</p>
                            <p className="text-xs text-gray-500 mt-0.5 capitalize">{parcela.sistemaRiego}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{parcela.areaHectareas} ha</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                            parcela.activo 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {parcela.activo ? 'ACTIVA' : 'INACTIVA'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleView(parcela)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(parcela)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(parcela)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
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
    </div>

    {/* Modal Crear Nueva Parcela */}
    {modalCreate && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Crear Nueva Parcela</h3>
            <button onClick={() => {
              setModalCreate(false)
              setFormData({
                nombre_parcela: '',
                codigo_catastral: '',
                id_region: '',
                id_tipo_suelo: '',
                sistema_riego: 'goteo',
                area_hectareas: '',
                pH_suelo: '',
                materia_organica_pct: ''
              })
              setSelectedDepartamento('')
            }} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre de la Parcela *</label>
                <input 
                  type="text" 
                  value={formData.nombreParcela}
                  onChange={(e) => setFormData({ ...formData, nombreParcela: e.target.value })}
                  placeholder="Ej: El Dorado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código Catastral</label>
                <input 
                  type="text" 
                  value={formData.codigoCatastral}
                  onChange={(e) => setFormData({ ...formData, codigoCatastral: e.target.value })}
                  placeholder="Ej: CAÑ-001-2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Departamento *</label>
                <select 
                  value={selectedDepartamento}
                  onChange={(e) => {
                    setSelectedDepartamento(e.target.value)
                    setFormData({ ...formData, idRegion: '' })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Seleccionar departamento</option>
                  {departamentos.map((depto) => (
                    <option key={depto.idDepartamento} value={depto.idDepartamento}>
                      {depto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Región *</label>
                <select 
                  value={formData.idRegion}
                  onChange={(e) => setFormData({ ...formData, idRegion: e.target.value })}
                  disabled={!selectedDepartamento}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar región</option>
                  {regionesFiltradas.map((region) => (
                    <option key={region.idRegion} value={region.idRegion}>
                      {region.nombre} ({region.provincia})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Tipo de Suelo *</label>
                <select 
                  value={formData.idTipoSuelo}
                  onChange={(e) => setFormData({ ...formData, idTipoSuelo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Seleccionar tipo de suelo</option>
                  {tiposSuelo.map((tipo) => (
                    <option key={tipo.idTipoSuelo} value={tipo.idTipoSuelo}>
                      {tipo.nombre} ({tipo.clasificacion})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Sistema de Riego *</label>
                <select 
                  value={formData.sistemaRiego}
                  onChange={(e) => setFormData({ ...formData, sistemaRiego: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                >
                  {sistemasRiegoOptions.map((sistema) => (
                    <option key={sistema.value} value={sistema.value}>
                      {sistema.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Área (hectáreas) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.areaHectareas}
                  onChange={(e) => setFormData({ ...formData, areaHectareas: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">pH del Suelo</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.phSuelo}
                  onChange={(e) => setFormData({ ...formData, phSuelo: e.target.value })}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Materia Orgánica (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.materiaOrganicaPct}
                  onChange={(e) => setFormData({ ...formData, materiaOrganicaPct: e.target.value })}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500">* Campos obligatorios</p>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button 
              onClick={() => {
                setModalCreate(false)
                setFormData({
                  nombre_parcela: '',
                  codigo_catastral: '',
                  id_region: '',
                  id_tipo_suelo: '',
                  sistema_riego: 'goteo',
                  area_hectareas: '',
                  pH_suelo: '',
                  materia_organica_pct: ''
                })
                setSelectedDepartamento('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreate}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Crear Parcela
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Ver Detalles */}
    {modalView && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Detalles de la Parcela</h3>
            <button onClick={() => setModalView(null)} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Código Catastral</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{modalView.codigoCatastral || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Nombre</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{modalView.nombreParcela}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Región</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.region?.nombre} - {modalView.region?.provincia}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Departamento</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.region?.departamento?.nombre}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Propietario</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.usuario?.nombre}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Tipo de Suelo</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.tipoSuelo?.nombre} ({modalView.tipoSuelo?.clasificacion})</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Sistema de Riego</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">{modalView.sistemaRiego}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Área</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.areaHectareas} ha</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">pH del Suelo</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.phSuelo || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Materia Orgánica</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.materiaOrganicaPct ? `${modalView.materiaOrganicaPct}%` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de Registro</label>
                <p className="text-sm text-gray-900 mt-1">{modalView.creadoEn ? new Date(modalView.creadoEn).toLocaleDateString('es-PE') : 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase mt-1 ${
                  modalView.activo 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {modalView.activo ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
            <button 
              onClick={() => setModalView(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Editar */}
    {modalEdit && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Editar Lote</h3>
            <button onClick={() => setModalEdit(null)} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código</label>
                <input 
                  type="text" 
                  defaultValue={modalEdit.codigo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Nombre</label>
                <input 
                  type="text" 
                  defaultValue={modalEdit.nombre}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Región</label>
                <select 
                  defaultValue={modalEdit.region}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option>Valle Central</option>
                  <option>Delta Norte</option>
                  <option>Llanuras del Sur</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Cultivo</label>
                <select 
                  defaultValue={modalEdit.cultivo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option>Maíz</option>
                  <option>Soja</option>
                  <option>Trigo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Variedad</label>
                <input 
                  type="text" 
                  defaultValue={modalEdit.variedad}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Área (ha)</label>
                <input 
                  type="number" 
                  step="0.1"
                  defaultValue={modalEdit.area}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Fecha de Siembra</label>
                <input 
                  type="text" 
                  defaultValue={modalEdit.fecha_siembra}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Progreso (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  defaultValue={modalEdit.progreso}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button 
              onClick={() => setModalEdit(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                toast.success(`Lote ${modalEdit.nombre} actualizado correctamente`)
                setModalEdit(null)
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Eliminar */}
    {modalDelete && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700">
              ¿Estás seguro de que deseas eliminar el lote <span className="font-semibold">{modalDelete.codigo} "{modalDelete.nombre}"</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button 
              onClick={() => setModalDelete(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
