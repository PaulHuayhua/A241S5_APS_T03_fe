import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { siembraService } from '../services/siembra.service'
import { parcelaService } from '../services/parcela.service'

// Components
import SiembraStatsCards from '../components/SiembraStatsCards'
import SiembraFilters from '../components/SiembraFilters'
import SiembraTable from '../components/SiembraTable'
import SiembraForm from '../components/SiembraForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const SiembrasPageRefactored = () => {
  const [siembras, setSiembras] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [filters, setFilters] = useState({
    cultivo: 'todos',
    estado: '',
    parcela: []
  })
  
  // Modales
  const [showModalSiembra, setShowModalSiembra] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalView, setShowModalView] = useState(false)
  const [siembraToEdit, setSiembraToEdit] = useState(null)
  const [siembraToDelete, setSiembraToDelete] = useState(null)
  const [siembraToView, setSiembraToView] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [siembrasRes, parcelasRes] = await Promise.all([
        siembraService.getAll(),
        parcelaService.getAll()
      ])
      setSiembras(siembrasRes)
      setParcelas(parcelasRes)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (siembra) => {
    setSiembraToView(siembra)
    setShowModalView(true)
  }

  const handleEdit = (siembra) => {
    setSiembraToEdit(siembra)
    setShowModalSiembra(true)
  }

  const handleDelete = (siembra) => {
    setSiembraToDelete(siembra)
    setShowModalDelete(true)
  }

  const confirmDelete = async () => {
    try {
      // Cambiar estado a cancelada
      await siembraService.updateEstado(siembraToDelete.idSiembra, 'cancelada')
      toast.success('Siembra cancelada correctamente')
      setShowModalDelete(false)
      setSiembraToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al cancelar siembra:', error)
      toast.error('Error al cancelar la siembra')
    }
  }

  const handleFormSuccess = () => {
    setShowModalSiembra(false)
    setSiembraToEdit(null)
    loadData()
  }

  const clearFilters = () => {
    setFilters({ 
      cultivo: 'todos', 
      estado: '', 
      parcela: [] 
    })
  }

  // Obtener cultivos únicos
  const cultivosUnicos = [...new Set(siembras.map(s => s.variedad?.cultivo?.nombreComun).filter(Boolean))]

  // Filtrar siembras
  const filteredSiembras = siembras.filter(siembra => {
    const cultivoMatch = filters.cultivo === 'todos' || 
      siembra.variedad?.cultivo?.nombreComun === filters.cultivo
    const estadoMatch = !filters.estado || siembra.estado === filters.estado
    const parcelaMatch = filters.parcela.length === 0 || 
      filters.parcela.includes(siembra.parcela?.nombreParcela)
    
    return cultivoMatch && estadoMatch && parcelaMatch
  })

  // Calcular estadísticas
  const stats = {
    total: siembras.length,
    areaTotal: siembras.reduce((sum, s) => sum + (parseFloat(s.areaSembradaHa) || 0), 0),
    enCurso: siembras.filter(s => s.estado === 'en_curso').length,
    cosechadas: siembras.filter(s => s.estado === 'cosechada').length,
    canceladas: siembras.filter(s => s.estado === 'cancelada' || s.estado === 'perdida').length
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Siembras</h1>
          <p className="text-sm text-gray-500 mt-1">Administración de siembras y campañas agrícolas</p>
        </div>
        <button
          onClick={() => setShowModalSiembra(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva Siembra
        </button>
      </div>

      {/* Stats Cards */}
      <SiembraStatsCards stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters Panel */}
        <div className="col-span-3">
          <SiembraFilters 
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
            stats={stats}
            cultivos={cultivosUnicos}
            parcelas={parcelas}
          />
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
                    {filteredSiembras.length === siembras.length 
                      ? `${siembras.length} siembras en total`
                      : `${filteredSiembras.length} de ${siembras.length} siembras`
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
            <SiembraTable 
              siembras={filteredSiembras}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={false}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      {showModalSiembra && (
        <SiembraForm
          siembra={siembraToEdit}
          onClose={() => {
            setShowModalSiembra(false)
            setSiembraToEdit(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showModalDelete}
        onClose={() => {
          setShowModalDelete(false)
          setSiembraToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Cancelar Siembra"
        message={`¿Estás seguro de que deseas cancelar la siembra "${siembraToDelete?.codigoCampana}"?`}
        confirmText="Cancelar Siembra"
      />

      {/* Modal View */}
      {showModalView && siembraToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de Siembra</h3>
              <button onClick={() => setShowModalView(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Código de Campaña</p>
                  <p className="text-sm text-gray-900 font-mono">{siembraToView.codigoCampana}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Parcela</p>
                  <p className="text-sm text-gray-900">{siembraToView.parcela?.nombreParcela || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Cultivo</p>
                  <p className="text-sm text-gray-900">{siembraToView.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Variedad</p>
                  <p className="text-sm text-gray-900">{siembraToView.variedad?.nombreVariedad || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Fecha de Siembra</p>
                  <p className="text-sm text-gray-900">{siembraToView.fechaSiembra}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Área Sembrada</p>
                  <p className="text-sm text-gray-900">{siembraToView.areaSembradaHa} hectáreas</p>
                </div>
                {siembraToView.densidadPlantasHa && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Densidad</p>
                    <p className="text-sm text-gray-900">{siembraToView.densidadPlantasHa} plantas/ha</p>
                  </div>
                )}
                {siembraToView.notas && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notas</p>
                    <p className="text-sm text-gray-900">{siembraToView.notas}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                    siembraToView.estado === 'en_curso'
                      ? 'bg-green-100 text-green-700'
                      : siembraToView.estado === 'cosechada'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {siembraToView.estado === 'en_curso' ? 'EN CURSO' : 
                     siembraToView.estado === 'cosechada' ? 'COSECHADA' : 'CANCELADA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiembrasPageRefactored
