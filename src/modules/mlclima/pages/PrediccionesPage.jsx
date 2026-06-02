import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  PrediccionStatsCards,
  PrediccionForm,
  FactoresRiesgo,
  PrediccionTable,
  PrediccionCharts,
  ModalDetalle,
  ModalCambiarEstado,
  ModalEliminar
} from '../components'
import { prediccionService } from '../services'
import { siembraService } from '../../gestion/services'
import { exportToExcel, formatearFechaExcel, formatearNumeroExcel } from '../../../shared/utils/exportUtils'

export default function PrediccionesPageRefactored() {
  // Estados para datos de la API
  const [loading, setLoading] = useState(true)
  const [predicciones, setPredicciones] = useState([])
  const [siembrasDisponibles, setSiembrasDisponibles] = useState([])
  
  // Estados del formulario
  const [selectedModel, setSelectedModel] = useState('1')
  const [selectedSiembra, setSelectedSiembra] = useState('')
  const [fechaClimaInicio, setFechaClimaInicio] = useState('')
  const [fechaClimaFin, setFechaClimaFin] = useState('')
  const [fuenteClima, setFuenteClima] = useState('SENAMHI')
  
  // Estados de modales
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalEstado, setModalEstado] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // Cargar predicciones
      const prediccionesRes = await prediccionService.getAll()
      setPredicciones(prediccionesRes)
      
      // Cargar siembras disponibles (solo las activas)
      const siembrasRes = await siembraService.getAll()
      const siembrasActivas = siembrasRes.filter(s => s.estado === 'en_curso')
      setSiembrasDisponibles(siembrasActivas)
      
      if (prediccionesRes.length === 0) {
        console.log('No hay predicciones registradas')
      }
    } catch (error) {
      console.error('Error al cargar predicciones:', error)
      toast.error('Error al cargar las predicciones')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerarPrediccion = async () => {
    try {
      // Generar valores simulados para el rendimiento
      const rendimientoBase = Math.random() * 10 + 10 // 10-20 ton/ha
      const variacion = rendimientoBase * 0.15 // 15% de variación
      
      await prediccionService.create({
        siembra: { idSiembra: parseInt(selectedSiembra) },
        modelo: { idModelo: parseInt(selectedModel) },
        fechaPrediccion: new Date().toISOString().split('T')[0],
        fechaClimaInicio,
        fechaClimaFin,
        fuenteClima,
        rendimientoEstimadoTonHa: parseFloat(rendimientoBase.toFixed(2)),
        rendimientoMinTonHa: parseFloat((rendimientoBase - variacion).toFixed(2)),
        rendimientoMaxTonHa: parseFloat((rendimientoBase + variacion).toFixed(2)),
        intervaloConfianzaPct: parseFloat((Math.random() * 15 + 80).toFixed(2)),
        estado: 'activa',
        notas: `Predicción generada automáticamente usando ${fuenteClima}`
      })
      
      // Recargar todas las predicciones
      await cargarDatos()
      
      toast.success('Predicción generada correctamente')
      
      // Limpiar formulario
      setSelectedSiembra('')
      setFechaClimaInicio('')
      setFechaClimaFin('')
    } catch (error) {
      console.error('Error al generar predicción:', error)
      toast.error('Error al generar la predicción. Verifica que todos los datos sean correctos.')
    }
  }

  const handleExportar = () => {
    try {
      if (predicciones.length === 0) {
        toast.error('No hay predicciones para exportar')
        return
      }

      // Preparar datos para exportación
      const datosExportar = predicciones.map(pred => ({
        'ID': pred.idPrediccion,
        'Fecha Predicción': formatearFechaExcel(pred.fechaPrediccion),
        'Parcela': pred.siembra?.parcela?.nombreParcela || 'N/A',
        'Cultivo': pred.siembra?.variedad?.cultivo?.nombreComun || 'N/A',
        'Variedad': pred.siembra?.variedad?.nombreVariedad || 'N/A',
        'Modelo ML': pred.modelo?.nombreModelo || 'N/A',
        'Fecha Inicio Clima': formatearFechaExcel(pred.fechaClimaInicio),
        'Fecha Fin Clima': formatearFechaExcel(pred.fechaClimaFin),
        'Fuente Clima': pred.fuenteClima || 'N/A',
        'Rendimiento Estimado (ton/ha)': formatearNumeroExcel(pred.rendimientoEstimadoTonHa),
        'Rendimiento Mínimo (ton/ha)': formatearNumeroExcel(pred.rendimientoMinTonHa),
        'Rendimiento Máximo (ton/ha)': formatearNumeroExcel(pred.rendimientoMaxTonHa),
        'Intervalo Confianza (%)': formatearNumeroExcel(pred.intervaloConfianzaPct),
        'Estado': pred.estado || 'N/A',
        'Notas': pred.notas || ''
      }))

      // Generar nombre de archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0]
      const nombreArchivo = `Predicciones_IA_${fecha}`

      // Exportar a Excel
      exportToExcel(datosExportar, nombreArchivo, 'Predicciones')

      toast.success(`${predicciones.length} predicciones exportadas correctamente`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar las predicciones')
    }
  }

  const handleVerDetalle = (prediccion) => {
    setModalDetalle(prediccion)
  }

  const handleCambiarEstado = (prediccion) => {
    setModalEstado(prediccion)
  }

  const handleEliminar = (prediccion) => {
    setModalEliminar(prediccion)
  }

  const confirmarCambioEstado = async (nuevoEstado) => {
    try {
      const prediccionActualizada = {
        ...modalEstado,
        estado: nuevoEstado
      }
      
      await prediccionService.update(modalEstado.idPrediccion, prediccionActualizada)
      
      // Actualizar la lista local
      setPredicciones(predicciones.map(p => 
        p.idPrediccion === modalEstado.idPrediccion 
          ? { ...p, estado: nuevoEstado }
          : p
      ))
      
      toast.success(`Estado actualizado a: ${nuevoEstado}`)
      setModalEstado(null)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al actualizar el estado')
    }
  }

  const confirmarEliminar = async () => {
    try {
      await prediccionService.delete(modalEliminar.idPrediccion)
      setPredicciones(predicciones.filter(p => p.idPrediccion !== modalEliminar.idPrediccion))
      toast.success('Predicción eliminada correctamente')
      setModalEliminar(null)
    } catch (error) {
      console.error('Error al eliminar predicción:', error)
      toast.error('Error al eliminar la predicción')
    }
  }

  // Calcular estadísticas
  const stats = {
    precisionPromedio: 89.5,
    prediccionesActivas: predicciones.filter(p => p.estado === 'activa').length,
    parcelasMonitoreadas: new Set(predicciones.map(p => p.siembra?.parcela?.idParcela)).size,
    modelosActivos: 3,
    rendimientoEstimado: 94.2
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando predicciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predicciones de IA</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Análisis predictivo con Machine Learning para optimización de rendimiento
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <PrediccionStatsCards stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Sidebar - Nueva Predicción */}
        <div className="col-span-3 space-y-5">
          <PrediccionForm
            siembrasDisponibles={siembrasDisponibles}
            selectedSiembra={selectedSiembra}
            setSelectedSiembra={setSelectedSiembra}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            fechaClimaInicio={fechaClimaInicio}
            setFechaClimaInicio={setFechaClimaInicio}
            fechaClimaFin={fechaClimaFin}
            setFechaClimaFin={setFechaClimaFin}
            fuenteClima={fuenteClima}
            setFuenteClima={setFuenteClima}
            onGenerar={handleGenerarPrediccion}
          />

          <FactoresRiesgo />
        </div>

        {/* Main Content Area */}
        <div className="col-span-9 space-y-5">
          <PrediccionTable
            predicciones={predicciones}
            onVerDetalle={handleVerDetalle}
            onCambiarEstado={handleCambiarEstado}
            onEliminar={handleEliminar}
            onExportar={handleExportar}
          />

          <PrediccionCharts />
        </div>
      </div>

      {/* Modals */}
      <ModalDetalle 
        prediccion={modalDetalle} 
        onClose={() => setModalDetalle(null)} 
      />
      
      <ModalCambiarEstado 
        prediccion={modalEstado} 
        onConfirmar={confirmarCambioEstado}
        onClose={() => setModalEstado(null)} 
      />
      
      <ModalEliminar 
        prediccion={modalEliminar} 
        onConfirmar={confirmarEliminar}
        onClose={() => setModalEliminar(null)} 
      />
    </div>
  )
}
