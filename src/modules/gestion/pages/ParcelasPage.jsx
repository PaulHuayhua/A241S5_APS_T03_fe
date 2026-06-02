import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { parcelaService } from '../services/parcela.service'
import { departamentoService } from '../../../shared/services/geografia.service'
import { sueloService } from '../../../shared/services/suelo.service'

// Components
import ParcelaStatsCards from '../components/ParcelaStatsCards'
import ParcelaFilters from '../components/ParcelaFilters'
import ParcelaTable from '../components/ParcelaTable'
import ParcelaForm from '../components/ParcelaForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const ParcelasPageRefactored = () => {
  const [parcelas, setParcelas] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [tiposSuelo, setTiposSuelo] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [filters, setFilters] = useState({
    departamento: [],
    tipoSuelo: 'todos',
    estado: ''
  })
  
  // Modales
  const [showModalParcela, setShowModalParcela] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalView, setShowModalView] = useState(false)
  const [parcelaToEdit, setParcelaToEdit] = useState(null)
  const [parcelaToDelete, setParcelaToDelete] = useState(null)
  const [parcelaToView, setParcelaToView] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [parcelasRes, deptosRes, suelosRes] = await Promise.all([
        parcelaService.getAll(),
        departamentoService.getAll(),
        sueloService.getAll()
      ])
      setParcelas(parcelasRes)
      setDepartamentos(deptosRes)
      setTiposSuelo(suelosRes)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (parcela) => {
    setParcelaToView(parcela)
    setShowModalView(true)
  }

  const handleEdit = (parcela) => {
    setParcelaToEdit(parcela)
    setShowModalParcela(true)
  }

  const handleDelete = (parcela) => {
    setParcelaToDelete(parcela)
    setShowModalDelete(true)
  }

  const confirmDelete = async () => {
    try {
      const parcelaActualizada = {
        ...parcelaToDelete,
        activo: false
      }
      await parcelaService.update(parcelaToDelete.idParcela, parcelaActualizada)
      toast.success('Parcela desactivada correctamente')
      setShowModalDelete(false)
      setParcelaToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al desactivar parcela:', error)
      toast.error('Error al desactivar la parcela')
    }
  }

  const handleRestore = async (parcela) => {
    try {
      const parcelaActualizada = {
        ...parcela,
        activo: true
      }
      await parcelaService.update(parcela.idParcela, parcelaActualizada)
      toast.success('Parcela restaurada correctamente')
      loadData()
    } catch (error) {
      console.error('Error al restaurar parcela:', error)
      toast.error('Error al restaurar la parcela')
    }
  }

  const handleFormSuccess = () => {
    setShowModalParcela(false)
    setParcelaToEdit(null)
    loadData()
  }

  const clearFilters = () => {
    setFilters({ 
      departamento: [], 
      tipoSuelo: 'todos', 
      estado: '' 
    })
  }

  // Filtrar parcelas
  const filteredParcelas = parcelas.filter(parcela => {
    const deptoMatch = filters.departamento.length === 0 || 
      filters.departamento.includes(parcela.region?.departamento?.nombre)
    const tipoSueloMatch = filters.tipoSuelo === 'todos' || 
      parcela.tipoSuelo?.idTipoSuelo === parseInt(filters.tipoSuelo)
    const estadoMatch = !filters.estado || 
      (filters.estado === 'activo' && parcela.activo) ||
      (filters.estado === 'inactivo' && !parcela.activo)
    
    return deptoMatch && tipoSueloMatch && estadoMatch
  })

  // Calcular estadísticas
  const stats = {
    totalParcelas: parcelas.length,
    parcelasActivas: parcelas.filter(p => p.activo).length,
    areaTotal: parcelas.reduce((sum, p) => sum + (p.areaHectareas || 0), 0),
    phPromedio: parcelas.length > 0 
      ? parcelas.filter(p => p.phSuelo).reduce((sum, p) => sum + p.phSuelo, 0) / parcelas.filter(p => p.phSuelo).length
      : 0,
    materiaOrganicaPromedio: parcelas.length > 0
      ? parcelas.filter(p => p.materiaOrganicaPct).reduce((sum, p) => sum + p.materiaOrganicaPct, 0) / parcelas.filter(p => p.materiaOrganicaPct).length
      : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando parcelas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h1>
          <p className="text-sm text-gray-500 mt-1">Administración de parcelas agrícolas registradas</p>
        </div>
        <button
          onClick={() => setShowModalParcela(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva Parcela
        </button>
      </div>

      {/* Stats Cards */}
      <ParcelaStatsCards stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters Panel */}
        <div className="col-span-3">
          <ParcelaFilters 
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
            stats={stats}
            departamentos={departamentos}
            tiposSuelo={tiposSuelo}
          />
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
                {(filters.departamento.length > 0 || filters.tipoSuelo !== 'todos' || filters.estado) && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    Filtros aplicados
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <ParcelaTable 
              parcelas={filteredParcelas}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              loading={false}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      {showModalParcela && (
        <ParcelaForm
          parcela={parcelaToEdit}
          onClose={() => {
            setShowModalParcela(false)
            setParcelaToEdit(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showModalDelete}
        onClose={() => {
          setShowModalDelete(false)
          setParcelaToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Desactivar Parcela"
        message={`¿Estás seguro de que deseas desactivar la parcela "${parcelaToDelete?.nombreParcela}"?`}
        confirmText="Desactivar"
      />

      {/* Modal View - TO DO: Crear componente de vista detallada */}
      {showModalView && parcelaToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de Parcela</h3>
              <button onClick={() => setShowModalView(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</p>
                  <p className="text-sm text-gray-900">{parcelaToView.nombreParcela}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Código Catastral</p>
                  <p className="text-sm text-gray-900">{parcelaToView.codigoCatastral || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Región</p>
                  <p className="text-sm text-gray-900">
                    {parcelaToView.region?.nombre} - {parcelaToView.region?.provincia}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Suelo</p>
                  <p className="text-sm text-gray-900">{parcelaToView.tipoSuelo?.nombre}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Sistema de Riego</p>
                  <p className="text-sm text-gray-900 capitalize">{parcelaToView.sistemaRiego}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Área</p>
                  <p className="text-sm text-gray-900">{parcelaToView.areaHectareas} hectáreas</p>
                </div>
                {parcelaToView.phSuelo && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">pH del Suelo</p>
                    <p className="text-sm text-gray-900">{parcelaToView.phSuelo}</p>
                  </div>
                )}
                {parcelaToView.materiaOrganicaPct && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Materia Orgánica</p>
                    <p className="text-sm text-gray-900">{parcelaToView.materiaOrganicaPct}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                    parcelaToView.activo 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {parcelaToView.activo ? 'ACTIVA' : 'INACTIVA'}
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

export default ParcelasPageRefactored
