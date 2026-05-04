import { useState, useEffect } from 'react'
import { Plus, Eye, Edit, Trash2, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { siembraService, parcelaService, cultivoService, variedadService } from '../services'

export default function Siembras() {
  const [siembrasData, setSiembrasData] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [cultivos, setCultivos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [variedadesFiltradas, setVariedadesFiltradas] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    cultivo: 'todos',
    estado: '',
    parcela: []
  })

  const [showModal, setShowModal] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [selectedSiembra, setSelectedSiembra] = useState(null)
  const [modalDelete, setModalDelete] = useState(null)
  const [siembraToEdit, setSiembraToEdit] = useState(null)
  const [formData, setFormData] = useState({
    codigoCampana: '',
    idParcela: '',
    idCultivo: '',
    idVariedad: '',
    fechaSiembra: '',
    areaSembradaHa: '',
    densidadPlantasHa: '',
    notas: ''
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [siembrasRes, parcelasRes, cultivosRes, variedadesRes] = await Promise.all([
        siembraService.getAll(),
        parcelaService.getAll(),
        cultivoService.getAll(),
        variedadService.getAll()
      ])
      
      // Transformar datos de siembras
      const transformedData = siembrasRes.map(siembra => ({
        id: siembra.idSiembra,
        codigo: siembra.codigoCampana,
        parcela: siembra.parcela?.nombreParcela || 'N/A',
        cultivo: siembra.variedad?.cultivo?.nombreComun || 'N/A',
        variedad: siembra.variedad?.nombreVariedad || 'N/A',
        fecha_siembra: siembra.fechaSiembra,
        area: parseFloat(siembra.areaSembradaHa || 0),
        densidad: siembra.densidadPlantasHa || 0,
        estado: siembra.estado || 'en_curso',
        dias_transcurridos: calcularDiasTranscurridos(siembra.fechaSiembra),
        _raw: siembra
      }))
      
      setSiembrasData(transformedData)
      setParcelas(parcelasRes)
      setCultivos(cultivosRes)
      setVariedades(variedadesRes)
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const loadSiembras = async () => {
    try {
      const data = await siembraService.getAll()
      const transformedData = data.map(siembra => ({
        id: siembra.idSiembra,
        codigo: siembra.codigoCampana,
        parcela: siembra.parcela?.nombreParcela || 'N/A',
        cultivo: siembra.variedad?.cultivo?.nombreComun || 'N/A',
        variedad: siembra.variedad?.nombreVariedad || 'N/A',
        fecha_siembra: siembra.fechaSiembra,
        area: parseFloat(siembra.areaSembradaHa || 0),
        densidad: siembra.densidadPlantasHa || 0,
        estado: siembra.estado || 'en_curso',
        dias_transcurridos: calcularDiasTranscurridos(siembra.fechaSiembra),
        _raw: siembra
      }))
      setSiembrasData(transformedData)
    } catch (error) {
      console.error('Error al cargar siembras:', error)
      toast.error('Error al cargar las siembras')
    }
  }

  // Filtrar variedades cuando cambia el cultivo seleccionado
  useEffect(() => {
    if (formData.idCultivo) {
      const filtered = variedades.filter(v => v.cultivo?.idCultivo === parseInt(formData.idCultivo))
      setVariedadesFiltradas(filtered)
      // Resetear variedad seleccionada si no está en las filtradas
      if (formData.idVariedad && !filtered.find(v => v.idVariedad === parseInt(formData.idVariedad))) {
        setFormData(prev => ({ ...prev, idVariedad: '' }))
      }
    } else {
      setVariedadesFiltradas([])
    }
  }, [formData.idCultivo, variedades])

  const calcularDiasTranscurridos = (fechaSiembra) => {
    if (!fechaSiembra) return 0
    const hoy = new Date()
    const fecha = new Date(fechaSiembra)
    const diferencia = hoy - fecha
    return Math.floor(diferencia / (1000 * 60 * 60 * 24))
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`
  }

  const toggleParcela = (parcela) => {
    const newParcelas = filters.parcela.includes(parcela)
      ? filters.parcela.filter(p => p !== parcela)
      : [...filters.parcela, parcela]
    setFilters({ ...filters, parcela: newParcelas })
  }

  const clearFilters = () => {
    setFilters({ cultivo: 'todos', estado: '', parcela: [] })
  }

  // Filtrar datos
  const filteredSiembras = siembrasData.filter(siembra => {
    const cultivoMatch = filters.cultivo === 'todos' || siembra.cultivo === filters.cultivo
    const estadoMatch = !filters.estado || siembra.estado === filters.estado
    const parcelaMatch = filters.parcela.length === 0 || filters.parcela.includes(siembra.parcela)
    
    return cultivoMatch && estadoMatch && parcelaMatch
  })

  const handleDelete = async (id) => {
    try {
      // Usar 'perdida' temporalmente hasta que se actualice el constraint
      await siembraService.updateEstado(id, 'perdida')
      
      // Actualizar localmente
      setSiembrasData(siembrasData.map(s => 
        s.id === id ? { ...s, estado: 'perdida' } : s
      ))
      toast.success('Siembra cancelada correctamente')
      setModalDelete(null)
    } catch (error) {
      console.error('Error al cancelar siembra:', error)
      toast.error('Error al cancelar la siembra')
    }
  }

  const handleCreate = async () => {
    // Validar campos requeridos
    if (!formData.codigoCampana || !formData.idParcela || !formData.idVariedad || 
        !formData.fechaSiembra || !formData.areaSembradaHa) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    try {
      await siembraService.create({
        parcela: { idParcela: parseInt(formData.idParcela) },
        variedad: { idVariedad: parseInt(formData.idVariedad) },
        usuario: { idUsuario: 2 }, // Usuario por defecto (María González)
        codigoCampana: formData.codigoCampana,
        fechaSiembra: formData.fechaSiembra,
        areaSembradaHa: parseFloat(formData.areaSembradaHa),
        densidadPlantasHa: formData.densidadPlantasHa ? parseInt(formData.densidadPlantasHa) : null,
        estado: 'en_curso',
        notas: formData.notas || null
      })
      
      toast.success('Siembra registrada correctamente')
      setShowModal(false)
      setFormData({
        codigoCampana: '',
        idParcela: '',
        idCultivo: '',
        idVariedad: '',
        fechaSiembra: '',
        areaSembradaHa: '',
        densidadPlantasHa: '',
        notas: ''
      })
      loadSiembras()
    } catch (error) {
      console.error('Error al crear siembra:', error)
      toast.error('Error al registrar la siembra')
    }
  }

  const handleEditClick = (siembra) => {
    setSiembraToEdit(siembra)
    setFormData({
      codigoCampana: siembra._raw.codigoCampana || '',
      idParcela: siembra._raw.parcela?.idParcela?.toString() || '',
      idCultivo: siembra._raw.variedad?.cultivo?.idCultivo?.toString() || '',
      idVariedad: siembra._raw.variedad?.idVariedad?.toString() || '',
      fechaSiembra: siembra._raw.fechaSiembra || '',
      areaSembradaHa: siembra._raw.areaSembradaHa?.toString() || '',
      densidadPlantasHa: siembra._raw.densidadPlantasHa?.toString() || '',
      notas: siembra._raw.notas || ''
    })
    setShowModalEdit(true)
  }

  const handleUpdate = async () => {
    if (!formData.codigoCampana || !formData.idParcela || !formData.idVariedad || 
        !formData.fechaSiembra || !formData.areaSembradaHa) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    try {
      await siembraService.update(siembraToEdit.id, {
        parcela: { idParcela: parseInt(formData.idParcela) },
        variedad: { idVariedad: parseInt(formData.idVariedad) },
        usuario: siembraToEdit._raw.usuario,
        codigoCampana: formData.codigoCampana,
        fechaSiembra: formData.fechaSiembra,
        areaSembradaHa: parseFloat(formData.areaSembradaHa),
        densidadPlantasHa: formData.densidadPlantasHa ? parseInt(formData.densidadPlantasHa) : null,
        estado: siembraToEdit._raw.estado,
        notas: formData.notas || null
      })
      
      toast.success('Siembra actualizada correctamente')
      setShowModalEdit(false)
      setSiembraToEdit(null)
      setFormData({
        codigoCampana: '',
        idParcela: '',
        idCultivo: '',
        idVariedad: '',
        fechaSiembra: '',
        areaSembradaHa: '',
        densidadPlantasHa: '',
        notas: ''
      })
      loadSiembras()
    } catch (error) {
      console.error('Error al actualizar siembra:', error)
      toast.error('Error al actualizar la siembra')
    }
  }

  // Calcular estadísticas
  const stats = {
    total: siembrasData.length,
    areaTotal: siembrasData.reduce((sum, s) => sum + s.area, 0).toFixed(1),
    enCurso: siembrasData.filter(s => s.estado === 'en_curso').length,
    cosechadas: siembrasData.filter(s => s.estado === 'cosechada').length,
    canceladas: siembrasData.filter(s => s.estado === 'cancelada').length
  }

  // Obtener cultivos únicos para filtros
  const cultivosUnicos = [...new Set(siembrasData.map(s => s.cultivo))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando siembras...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Siembras</h1>
          <p className="text-sm text-gray-500 mt-1">Administración de siembras y campañas agrícolas</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva Siembra
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Siembras</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-2">Campañas registradas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Área Total</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.areaTotal}</p>
              <p className="text-sm text-gray-500 mt-2">Hectáreas sembradas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">En Curso</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.enCurso}</p>
              <p className="text-sm text-gray-500 mt-2">Siembras activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cosechadas</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stats.cosechadas}</p>
              <p className="text-sm text-gray-500 mt-2">Campañas finalizadas</p>
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
              {/* Cultivo */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Cultivo</h4>
                <select 
                  value={filters.cultivo}
                  onChange={(e) => setFilters({ ...filters, cultivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <option value="todos">Todos los cultivos</option>
                  {cultivosUnicos.map((cultivo) => (
                    <option key={cultivo} value={cultivo}>
                      {cultivo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parcela */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Parcela</h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {parcelas.map((parcela) => (
                    <label key={parcela.idParcela} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.parcela.includes(parcela.nombreParcela)}
                        onChange={() => toggleParcela(parcela.nombreParcela)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{parcela.nombreParcela}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Estado</h4>
                <div className="space-y-2">
                  {[
                    { value: 'en_curso', label: 'En Curso', count: stats.enCurso },
                    { value: 'cosechada', label: 'Cosechadas', count: stats.cosechadas },
                    { value: 'cancelada', label: 'Canceladas', count: stats.canceladas }
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
                  <h3 className="text-base font-semibold text-gray-900">Siembras Registradas</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {filteredSiembras.length === siembrasData.length 
                      ? `${siembrasData.length} siembras en total`
                      : `${filteredSiembras.length} de ${siembrasData.length} siembras`
                    }
                  </p>
                </div>
                {(filters.cultivo !== 'todos' || filters.estado || filters.parcela.length > 0) && (
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
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cultivo / Variedad</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha Siembra</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Área</span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Días</span>
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
                  {filteredSiembras.length > 0 ? (
                    filteredSiembras.map((siembra) => (
                      <tr key={siembra.id} className="bg-white">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{siembra.codigo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{siembra.parcela}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{siembra.cultivo}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{siembra.variedad}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{formatearFecha(siembra.fecha_siembra)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{siembra.area} ha</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{siembra.dias_transcurridos}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                            siembra.estado === 'en_curso' 
                              ? 'bg-green-100 text-green-700'
                              : siembra.estado === 'cosechada'
                              ? 'bg-blue-100 text-blue-700'
                              : siembra.estado === 'cancelada'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {siembra.estado === 'en_curso' ? 'EN CURSO' : siembra.estado === 'cosechada' ? 'COSECHADA' : siembra.estado === 'cancelada' ? 'CANCELADA' : 'PERDIDA'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedSiembra(siembra)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {siembra.estado === 'en_curso' && (
                              <>
                                <button 
                                  onClick={() => handleEditClick(siembra)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setModalDelete(siembra)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="Cancelar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
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

      {/* Modal Nueva Siembra */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Siembra</h3>
              <button onClick={() => {
                setShowModal(false)
                setFormData({
                  codigoCampana: '',
                  idParcela: '',
                  idCultivo: '',
                  idVariedad: '',
                  fechaSiembra: '',
                  areaSembradaHa: '',
                  densidadPlantasHa: '',
                  notas: ''
                })
              }} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código de Campaña *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                    placeholder="CAMP-2026-XXX"
                    value={formData.codigoCampana}
                    onChange={(e) => setFormData({ ...formData, codigoCampana: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Parcela *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formData.idParcela}
                    onChange={(e) => setFormData({ ...formData, idParcela: e.target.value })}
                  >
                    <option value="">Seleccionar parcela</option>
                    {parcelas.map((parcela) => (
                      <option key={parcela.idParcela} value={parcela.idParcela}>
                        {parcela.nombreParcela} ({parcela.areaHectareas} ha)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Cultivo *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formData.idCultivo}
                    onChange={(e) => setFormData({ ...formData, idCultivo: e.target.value, idVariedad: '' })}
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
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Variedad *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={formData.idVariedad}
                    onChange={(e) => setFormData({ ...formData, idVariedad: e.target.value })}
                    disabled={!formData.idCultivo}
                  >
                    <option value="">Seleccionar variedad</option>
                    {variedadesFiltradas.map((variedad) => (
                      <option key={variedad.idVariedad} value={variedad.idVariedad}>
                        {variedad.nombreVariedad}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Fecha de Siembra *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    value={formData.fechaSiembra}
                    onChange={(e) => setFormData({ ...formData, fechaSiembra: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Área Sembrada (ha) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                    placeholder="0.0"
                    value={formData.areaSembradaHa}
                    onChange={(e) => setFormData({ ...formData, areaSembradaHa: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Densidad (plantas/ha)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                    placeholder="0"
                    value={formData.densidadPlantasHa}
                    onChange={(e) => setFormData({ ...formData, densidadPlantasHa: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Notas</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                  rows="3" 
                  placeholder="Observaciones adicionales..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                ></textarea>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowModal(false)
                  setFormData({
                    codigoCampana: '',
                    idParcela: '',
                    idCultivo: '',
                    idVariedad: '',
                    fechaSiembra: '',
                    areaSembradaHa: '',
                    densidadPlantasHa: '',
                    notas: ''
                  })
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Crear Siembra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Siembra */}
      {showModalEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Editar Siembra</h3>
              <button onClick={() => {
                setShowModalEdit(false)
                setSiembraToEdit(null)
                setFormData({
                  codigoCampana: '',
                  idParcela: '',
                  idCultivo: '',
                  idVariedad: '',
                  fechaSiembra: '',
                  areaSembradaHa: '',
                  densidadPlantasHa: '',
                  notas: ''
                })
              }} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Código de Campaña *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                    placeholder="CAMP-2026-XXX"
                    value={formData.codigoCampana}
                    onChange={(e) => setFormData({ ...formData, codigoCampana: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Parcela *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formData.idParcela}
                    onChange={(e) => setFormData({ ...formData, idParcela: e.target.value })}
                  >
                    <option value="">Seleccionar parcela</option>
                    {parcelas.map((parcela) => (
                      <option key={parcela.idParcela} value={parcela.idParcela}>
                        {parcela.nombreParcela} ({parcela.areaHectareas} ha)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Cultivo *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                    value={formData.idCultivo}
                    onChange={(e) => setFormData({ ...formData, idCultivo: e.target.value, idVariedad: '' })}
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
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Variedad *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={formData.idVariedad}
                    onChange={(e) => setFormData({ ...formData, idVariedad: e.target.value })}
                    disabled={!formData.idCultivo}
                  >
                    <option value="">Seleccionar variedad</option>
                    {variedadesFiltradas.map((variedad) => (
                      <option key={variedad.idVariedad} value={variedad.idVariedad}>
                        {variedad.nombreVariedad}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Fecha de Siembra *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    value={formData.fechaSiembra}
                    onChange={(e) => setFormData({ ...formData, fechaSiembra: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Área Sembrada (ha) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="0.0"
                    value={formData.areaSembradaHa}
                    onChange={(e) => setFormData({ ...formData, areaSembradaHa: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Densidad (plantas/ha)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                    placeholder="0"
                    value={formData.densidadPlantasHa}
                    onChange={(e) => setFormData({ ...formData, densidadPlantasHa: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase block mb-2">Notas</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" 
                  rows="3" 
                  placeholder="Observaciones adicionales..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                ></textarea>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">* Campos obligatorios</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowModalEdit(false)
                  setSiembraToEdit(null)
                  setFormData({
                    codigoCampana: '',
                    idParcela: '',
                    idCultivo: '',
                    idVariedad: '',
                    fechaSiembra: '',
                    areaSembradaHa: '',
                    densidadPlantasHa: '',
                    notas: ''
                  })
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Actualizar Siembra
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
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Cancelación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas cancelar la siembra <span className="font-semibold">{modalDelete.codigo}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                La siembra se marcará como cancelada y no podrá ser modificada.
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
                onClick={() => handleDelete(modalDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {selectedSiembra && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Siembra</h3>
              <button onClick={() => setSelectedSiembra(null)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Código de Campaña</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedSiembra.codigo}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Parcela</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.parcela}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Cultivo</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.cultivo}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Variedad</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.variedad}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha de Siembra</label>
                  <p className="text-sm text-gray-900 mt-1">{formatearFecha(selectedSiembra.fecha_siembra)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Área Sembrada</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.area} ha</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Densidad</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.densidad ? selectedSiembra.densidad.toLocaleString() : 'N/A'} plantas/ha</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Días Transcurridos</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedSiembra.dias_transcurridos} días</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase mt-1 ${
                    selectedSiembra.estado === 'en_curso' 
                      ? 'bg-green-100 text-green-700'
                      : selectedSiembra.estado === 'cosechada'
                      ? 'bg-blue-100 text-blue-700'
                      : selectedSiembra.estado === 'cancelada'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {selectedSiembra.estado === 'en_curso' ? 'EN CURSO' : selectedSiembra.estado === 'cosechada' ? 'COSECHADA' : selectedSiembra.estado === 'cancelada' ? 'CANCELADA' : 'PERDIDA'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setSelectedSiembra(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
