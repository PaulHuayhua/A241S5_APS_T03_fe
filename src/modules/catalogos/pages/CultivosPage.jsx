import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import useApi from '../../../shared/hooks/useApi'
import { cultivoService } from '../services/cultivo.service'
import CultivoForm from '../components/CultivoForm'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const CultivosPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedCultivo, setSelectedCultivo] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [cultivoToDelete, setCultivoToDelete] = useState(null)

  const { data: cultivos, loading, execute: fetchCultivos } = useApi(cultivoService.getAll)
  const { execute: deleteCultivo } = useApi(cultivoService.delete)

  useEffect(() => {
    fetchCultivos()
  }, [fetchCultivos])

  const handleEdit = (cultivo) => {
    setSelectedCultivo(cultivo)
    setShowForm(true)
  }

  const handleDelete = (cultivo) => {
    setCultivoToDelete(cultivo)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCultivo(cultivoToDelete.id)
      await fetchCultivos()
      setShowDeleteDialog(false)
      setCultivoToDelete(null)
    } catch (error) {
      console.error('Error al eliminar cultivo:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedCultivo(null)
    fetchCultivos()
  }

  const filteredCultivos = cultivos?.filter(cultivo =>
    cultivo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cultivos</h1>
          <p className="text-gray-600 mt-1">Gestión de catálogo de cultivos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Cultivo
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar cultivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando cultivos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Científico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciclo (días)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCultivos.map((cultivo) => (
                  <tr key={cultivo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cultivo.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{cultivo.nombreCientifico}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cultivo.cicloVida}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(cultivo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cultivo)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCultivos.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No se encontraron cultivos
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <CultivoForm
          cultivo={selectedCultivo}
          onClose={() => {
            setShowForm(false)
            setSelectedCultivo(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setCultivoToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Cultivo"
        message={`¿Estás seguro de que deseas eliminar el cultivo "${cultivoToDelete?.nombre}"?`}
        confirmText="Eliminar"
      />
    </div>
  )
}

export default CultivosPage
