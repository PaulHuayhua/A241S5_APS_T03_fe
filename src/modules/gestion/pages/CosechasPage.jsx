import { useState, useEffect } from 'react'
import { Plus, Loader2, Download, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { cosechaService } from '../services/cosecha.service'

// Components
import CosechaStatsCards from '../components/CosechaStatsCards'
import CosechaTable from '../components/CosechaTable'
import CosechaForm from '../components/CosechaForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const CosechasPageRefactored = () => {
  const [cosechas, setCosechas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState({
    busqueda: '',
    calidad: 'todos',
    metodo: 'todos',
    fechaDesde: '',
    fechaHasta: ''
  })
  
  // Modales
  const [showModalCosecha, setShowModalCosecha] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalView, setShowModalView] = useState(false)
  const [cosechaToEdit, setCosechaToEdit] = useState(null)
  const [cosechaToDelete, setCosechaToDelete] = useState(null)
  const [cosechaToView, setCosechaToView] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await cosechaService.getAll()
      setCosechas(data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (cosecha) => {
    setCosechaToView(cosecha)
    setShowModalView(true)
  }

  const handleEdit = (cosecha) => {
    setCosechaToEdit(cosecha)
    setShowModalCosecha(true)
  }

  const handleDelete = (cosecha) => {
    setCosechaToDelete(cosecha)
    setShowModalDelete(true)
  }

  const confirmDelete = async () => {
    try {
      await cosechaService.delete(cosechaToDelete.idCosecha)
      toast.success('Cosecha eliminada correctamente')
      setShowModalDelete(false)
      setCosechaToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al eliminar cosecha:', error)
      toast.error('Error al eliminar la cosecha')
    }
  }

  const handleFormSuccess = () => {
    setShowModalCosecha(false)
    setCosechaToEdit(null)
    loadData()
  }

  const clearFilters = () => {
    setFilters({ 
      busqueda: '',
      calidad: 'todos', 
      metodo: 'todos',
      fechaDesde: '',
      fechaHasta: ''
    })
  }

  // Filtrar cosechas
  const filteredCosechas = cosechas.filter(cosecha => {
    const busquedaMatch = !filters.busqueda || 
      cosecha.siembra?.codigoCampana?.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      cosecha.siembra?.parcela?.nombreParcela?.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      cosecha.siembra?.variedad?.cultivo?.nombreComun?.toLowerCase().includes(filters.busqueda.toLowerCase())
    
    const calidadMatch = filters.calidad === 'todos' || 
      cosecha.calidadGrado?.toLowerCase() === filters.calidad.toLowerCase()
    
    const metodoMatch = filters.metodo === 'todos' || 
      cosecha.metodoMedicion?.toLowerCase() === filters.metodo.toLowerCase()
    
    const fechaDesdeMatch = !filters.fechaDesde || 
      new Date(cosecha.fechaCosecha) >= new Date(filters.fechaDesde)
    
    const fechaHastaMatch = !filters.fechaHasta || 
      new Date(cosecha.fechaCosecha) <= new Date(filters.fechaHasta)
    
    return busquedaMatch && calidadMatch && metodoMatch && fechaDesdeMatch && fechaHastaMatch
  })

  // Calcular estadísticas
  const stats = {
    total: cosechas.length,
    produccionTotal: cosechas.reduce((sum, c) => sum + ((Number(c.produccionKg) || 0) / 1000), 0),
    rendimientoPromedio: cosechas.length > 0
      ? cosechas.reduce((sum, c) => sum + (Number(c.rendimientoTonHa) || 0), 0) / cosechas.length
      : 0,
    calidadPrimera: cosechas.length > 0
      ? (cosechas.filter(c => c.calidadGrado?.toLowerCase() === 'primera').length / cosechas.length) * 100
      : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando cosechas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Cosechas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión y seguimiento de cosechas realizadas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast('📦 Función de exportar en desarrollo')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowModalCosecha(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva Cosecha
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <CosechaStatsCards stats={stats} />

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
          {(filters.busqueda || filters.calidad !== 'todos' || filters.metodo !== 'todos' || filters.fechaDesde || filters.fechaHasta) && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Buscar</label>
              <input
                type="text"
                value={filters.busqueda}
                onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
                placeholder="Buscar por parcela, cultivo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Calidad */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Calidad</label>
              <select
                value={filters.calidad}
                onChange={(e) => setFilters({ ...filters, calidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                <option value="todos">Todas las calidades</option>
                <option value="primera">Primera</option>
                <option value="segunda">Segunda</option>
                <option value="tercera">Tercera</option>
                <option value="descarte">Descarte</option>
              </select>
            </div>

            {/* Método */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Método</label>
              <select
                value={filters.metodo}
                onChange={(e) => setFilters({ ...filters, metodo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                <option value="todos">Todos los métodos</option>
                <option value="bascula">Báscula</option>
                <option value="estimado">Estimado</option>
              </select>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Fecha Desde</label>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Historial de Cosechas</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredCosechas.length} {filteredCosechas.length === 1 ? 'registro' : 'registros'}
              </p>
            </div>
            {(filters.busqueda || filters.calidad !== 'todos' || filters.metodo !== 'todos' || filters.fechaDesde || filters.fechaHasta) && (
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                Filtros aplicados
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <CosechaTable 
          cosechas={filteredCosechas}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={false}
        />
      </div>

      {/* Modales */}
      {showModalCosecha && (
        <CosechaForm
          cosecha={cosechaToEdit}
          onClose={() => {
            setShowModalCosecha(false)
            setCosechaToEdit(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showModalDelete}
        onClose={() => {
          setShowModalDelete(false)
          setCosechaToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Cosecha"
        message="¿Estás seguro de que deseas eliminar este registro de cosecha? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />

      {/* Modal View */}
      {showModalView && cosechaToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de Cosecha</h3>
              <button onClick={() => setShowModalView(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Campaña</p>
                  <p className="text-sm text-gray-900">{cosechaToView.siembra?.codigoCampana || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Parcela</p>
                  <p className="text-sm text-gray-900">{cosechaToView.siembra?.parcela?.nombreParcela || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Cultivo</p>
                  <p className="text-sm text-gray-900">{cosechaToView.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Variedad</p>
                  <p className="text-sm text-gray-900">{cosechaToView.siembra?.variedad?.nombreVariedad || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Fecha de Cosecha</p>
                  <p className="text-sm text-gray-900">{cosechaToView.fechaCosecha}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Área Cosechada</p>
                  <p className="text-sm text-gray-900">{cosechaToView.areaCosechadaHa} hectáreas</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Producción</p>
                  <p className="text-sm text-gray-900">
                    {cosechaToView.produccionKg ? (cosechaToView.produccionKg / 1000).toFixed(2) : '0.00'} ton ({cosechaToView.produccionKg || 0} kg)
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Rendimiento</p>
                  <p className="text-sm font-semibold text-primary-600">
                    {cosechaToView.rendimientoTonHa ? Number(cosechaToView.rendimientoTonHa).toFixed(2) : '0.00'} ton/ha
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Método</p>
                  <p className="text-sm text-gray-900 capitalize">{cosechaToView.metodoMedicion}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Calidad</p>
                  <p className="text-sm text-gray-900 capitalize">{cosechaToView.calidadGrado}</p>
                </div>
                {cosechaToView.humedadPct && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Humedad</p>
                    <p className="text-sm text-gray-900">{cosechaToView.humedadPct}%</p>
                  </div>
                )}
                {cosechaToView.notas && (
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notas</p>
                    <p className="text-sm text-gray-900">{cosechaToView.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CosechasPageRefactored
