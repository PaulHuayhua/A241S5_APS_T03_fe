import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { alertaService } from '../services'

// Components
import {
  AlertaStatsCards,
  AlertaFilters,
  AlertaTable,
  AlertaForm,
  AlertaDetalleModal
} from '../components'

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [filters, setFilters] = useState({
    tipoEvento: [],
    nivelRiesgo: 'todos',
    estado: ''
  })
  
  // Modales
  const [showForm, setShowForm] = useState(false)
  const [showDetalle, setShowDetalle] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null)
  const [alertaToDelete, setAlertaToDelete] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const alertasRes = await alertaService.getAll()
      setAlertas(alertasRes)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleCrearAlerta = () => {
    setAlertaSeleccionada(null)
    setShowForm(true)
  }

  const handleEditarAlerta = (alerta) => {
    setAlertaSeleccionada(alerta)
    setShowForm(true)
  }

  const handleVerDetalle = (alerta) => {
    setAlertaSeleccionada(alerta)
    setShowDetalle(true)
  }

  const handleSubmitForm = async (formData) => {
    try {
      const alertaData = {
        region: formData.region,
        tipoEvento: formData.tipoEvento,
        nivelRiesgo: formData.nivelRiesgo.toLowerCase(),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin || null,
        descripcion: formData.descripcion,
        activa: formData.activa
      }

      if (alertaSeleccionada) {
        await alertaService.update(alertaSeleccionada.idAlerta, alertaData)
        toast.success('Alerta actualizada correctamente')
      } else {
        await alertaService.create(alertaData)
        toast.success('Alerta creada correctamente')
      }
      
      setShowForm(false)
      setAlertaSeleccionada(null)
      loadData()
    } catch (error) {
      console.error('Error al guardar alerta:', error)
      toast.error('Error al guardar la alerta')
    }
  }

  const handleActivar = async (idAlerta) => {
    try {
      await alertaService.activar(idAlerta)
      toast.success('Alerta reactivada')
      loadData()
    } catch (error) {
      console.error('Error al activar alerta:', error)
      toast.error('Error al activar la alerta')
    }
  }

  const handleDesactivar = async (idAlerta) => {
    try {
      await alertaService.desactivar(idAlerta)
      toast.success('Alerta cerrada')
      loadData()
    } catch (error) {
      console.error('Error al desactivar alerta:', error)
      toast.error('Error al cerrar la alerta')
    }
  }

  const handleDelete = (alerta) => {
    setAlertaToDelete(alerta)
    setShowModalDelete(true)
  }

  const confirmDelete = async () => {
    try {
      await alertaService.delete(alertaToDelete.idAlerta)
      toast.success('Alerta eliminada')
      setShowModalDelete(false)
      setAlertaToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al eliminar alerta:', error)
      toast.error('Error al eliminar la alerta')
    }
  }

  const clearFilters = () => {
    setFilters({
      tipoEvento: [],
      nivelRiesgo: 'todos',
      estado: ''
    })
  }

  // Filtrar alertas
  const filteredAlertas = alertas.filter(alerta => {
    const tipoEventoMatch = filters.tipoEvento.length === 0 || 
      filters.tipoEvento.includes(alerta.tipoEvento)
    const nivelMatch = filters.nivelRiesgo === 'todos' || 
      (alerta.nivelRiesgo || '').toUpperCase() === filters.nivelRiesgo
    const estadoMatch = !filters.estado || 
      (filters.estado === 'activa' && alerta.activa) ||
      (filters.estado === 'cerrada' && !alerta.activa)
    
    return tipoEventoMatch && nivelMatch && estadoMatch
  })

  // Calcular estadísticas
  const stats = {
    totalAlertas: alertas.length,
    alertasActivas: alertas.filter(a => a.activa).length,
    alertasCriticas: alertas.filter(a => a.activa && (a.nivelRiesgo || '').toUpperCase() === 'CRITICO').length,
    alertasCerradas: alertas.filter(a => !a.activa).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando alertas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Alertas</h1>
          <p className="text-sm text-gray-500 mt-1">Monitoreo de alertas climáticas y eventos meteorológicos</p>
        </div>
        <button
          onClick={handleCrearAlerta}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva Alerta
        </button>
      </div>

      {/* Stats Cards */}
      <AlertaStatsCards stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters Panel */}
        <div className="col-span-3">
          <AlertaFilters
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
            stats={stats}
          />
        </div>

        {/* Content Area */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Alertas Climáticas</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {filteredAlertas.length === alertas.length
                      ? `${alertas.length} alertas en total`
                      : `${filteredAlertas.length} de ${alertas.length} alertas`
                    }
                  </p>
                </div>
                {(filters.tipoEvento.length > 0 || filters.nivelRiesgo !== 'todos' || filters.estado) && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    Filtros aplicados
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <AlertaTable
              alertas={filteredAlertas}
              onVerDetalle={handleVerDetalle}
              onEdit={handleEditarAlerta}
              onActivar={handleActivar}
              onDesactivar={handleDesactivar}
              onEliminar={handleDelete}
              loading={false}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      {showForm && (
        <AlertaForm
          alerta={alertaSeleccionada}
          onSubmit={handleSubmitForm}
          onClose={() => {
            setShowForm(false)
            setAlertaSeleccionada(null)
          }}
        />
      )}

      {showDetalle && (
        <AlertaDetalleModal
          alerta={alertaSeleccionada}
          onClose={() => {
            setShowDetalle(false)
            setAlertaSeleccionada(null)
          }}
        />
      )}

      {/* Modal Delete Confirmation */}
      {showModalDelete && alertaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Alerta</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la alerta de <strong>{alertaToDelete.tipoEvento}</strong> en <strong>{alertaToDelete.region?.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModalDelete(false)
                  setAlertaToDelete(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
