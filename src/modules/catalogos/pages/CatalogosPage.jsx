import { useState, useEffect } from 'react'
import { Leaf, Sprout, Loader2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { cultivoService, variedadService } from '../services'

// Components
import StatsCards from '../components/StatsCards'
import CultivoFilters from '../components/CultivoFilters'
import CultivoTable from '../components/CultivoTable'
import CultivoForm from '../components/CultivoForm'
import VariedadFilters from '../components/VariedadFilters'
import VariedadTable from '../components/VariedadTable'
import VariedadForm from '../components/VariedadForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const CatalogosPageRefactored = () => {
  const [activeTab, setActiveTab] = useState('cultivos')
  const [cultivos, setCultivos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [filters, setFilters] = useState({
    tipoCultivo: 'todos',
    estado: '',
    cultivoVariedad: 'todos',
    resistenciaSequia: false,
    resistenciaHelada: false,
    estadoVariedad: ''
  })
  
  // Modales Cultivos
  const [showModalCultivo, setShowModalCultivo] = useState(false)
  const [showModalDeleteCultivo, setShowModalDeleteCultivo] = useState(false)
  const [cultivoToEdit, setCultivoToEdit] = useState(null)
  const [cultivoToDelete, setCultivoToDelete] = useState(null)

  // Modales Variedades
  const [showModalVariedad, setShowModalVariedad] = useState(false)
  const [showModalDeleteVariedad, setShowModalDeleteVariedad] = useState(false)
  const [variedadToEdit, setVariedadToEdit] = useState(null)
  const [variedadToDelete, setVariedadToDelete] = useState(null)

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

  const handleEditCultivo = (cultivo) => {
    setCultivoToEdit(cultivo)
    setShowModalCultivo(true)
  }

  const handleDeleteCultivo = (cultivo) => {
    setCultivoToDelete(cultivo)
    setShowModalDeleteCultivo(true)
  }

  const confirmDeleteCultivo = async () => {
    try {
      const cultivoActualizado = {
        ...cultivoToDelete,
        activo: false
      }
      await cultivoService.update(cultivoToDelete.idCultivo, cultivoActualizado)
      toast.success('Cultivo desactivado correctamente')
      setShowModalDeleteCultivo(false)
      setCultivoToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al desactivar cultivo:', error)
      toast.error('Error al desactivar el cultivo')
    }
  }

  const handleRestoreCultivo = async (cultivo) => {
    try {
      const cultivoActualizado = {
        ...cultivo,
        activo: true
      }
      await cultivoService.update(cultivo.idCultivo, cultivoActualizado)
      toast.success('Cultivo restaurado correctamente')
      loadData()
    } catch (error) {
      console.error('Error al restaurar cultivo:', error)
      toast.error('Error al restaurar el cultivo')
    }
  }

  const handleFormSuccessCultivo = () => {
    setShowModalCultivo(false)
    setCultivoToEdit(null)
    loadData()
  }

  // Handlers de Variedades
  const handleEditVariedad = (variedad) => {
    setVariedadToEdit(variedad)
    setShowModalVariedad(true)
  }

  const handleDeleteVariedad = (variedad) => {
    setVariedadToDelete(variedad)
    setShowModalDeleteVariedad(true)
  }

  const confirmDeleteVariedad = async () => {
    try {
      const variedadActualizada = {
        ...variedadToDelete,
        activo: false
      }
      await variedadService.update(variedadToDelete.idVariedad, variedadActualizada)
      toast.success('Variedad desactivada correctamente')
      setShowModalDeleteVariedad(false)
      setVariedadToDelete(null)
      loadData()
    } catch (error) {
      console.error('Error al desactivar variedad:', error)
      toast.error('Error al desactivar la variedad')
    }
  }

  const handleRestoreVariedad = async (variedad) => {
    try {
      const variedadActualizada = {
        ...variedad,
        activo: true
      }
      await variedadService.update(variedad.idVariedad, variedadActualizada)
      toast.success('Variedad restaurada correctamente')
      loadData()
    } catch (error) {
      console.error('Error al restaurar variedad:', error)
      toast.error('Error al restaurar la variedad')
    }
  }

  const handleFormSuccessVariedad = () => {
    setShowModalVariedad(false)
    setVariedadToEdit(null)
    loadData()
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de cultivos y variedades</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

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
            <CultivoFilters 
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              stats={stats}
              tiposCultivo={tiposCultivoUnicos}
            />
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
              <CultivoTable 
                cultivos={filteredCultivos}
                onEdit={handleEditCultivo}
                onDelete={handleDeleteCultivo}
                onRestore={handleRestoreCultivo}
                loading={false}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'variedades' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Panel */}
          <div className="col-span-3">
            <VariedadFilters 
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              stats={stats}
              cultivos={cultivos}
            />
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
              <VariedadTable 
                variedades={filteredVariedades}
                onEdit={handleEditVariedad}
                onDelete={handleDeleteVariedad}
                onRestore={handleRestoreVariedad}
                loading={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals Cultivos */}
      {showModalCultivo && (
        <CultivoForm
          cultivo={cultivoToEdit}
          onClose={() => {
            setShowModalCultivo(false)
            setCultivoToEdit(null)
          }}
          onSuccess={handleFormSuccessCultivo}
        />
      )}

      <ConfirmDialog
        isOpen={showModalDeleteCultivo}
        onClose={() => {
          setShowModalDeleteCultivo(false)
          setCultivoToDelete(null)
        }}
        onConfirm={confirmDeleteCultivo}
        title="Desactivar Cultivo"
        message={`¿Estás seguro de que deseas desactivar el cultivo "${cultivoToDelete?.nombreComun}"?`}
        confirmText="Desactivar"
      />

      {/* Modals Variedades */}
      {showModalVariedad && (
        <VariedadForm
          variedad={variedadToEdit}
          cultivos={cultivos}
          onClose={() => {
            setShowModalVariedad(false)
            setVariedadToEdit(null)
          }}
          onSuccess={handleFormSuccessVariedad}
        />
      )}

      <ConfirmDialog
        isOpen={showModalDeleteVariedad}
        onClose={() => {
          setShowModalDeleteVariedad(false)
          setVariedadToDelete(null)
        }}
        onConfirm={confirmDeleteVariedad}
        title="Desactivar Variedad"
        message={`¿Estás seguro de que deseas desactivar la variedad "${variedadToDelete?.nombreVariedad}"?`}
        confirmText="Desactivar"
      />
    </div>
  )
}

export default CatalogosPageRefactored
