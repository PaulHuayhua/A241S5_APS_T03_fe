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
  ModalEliminar,
  ModalEditar
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
  const [modalEditar, setModalEditar] = useState(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)

      // Cargar predicciones y siembras en paralelo, manejando errores individualmente
      const [prediccionesRes, siembrasRes] = await Promise.allSettled([
        prediccionService.getAll(),
        siembraService.getAll()
      ])

      // Predicciones
      if (prediccionesRes.status === 'fulfilled') {
        setPredicciones(prediccionesRes.value || [])
      } else {
        console.error('Error cargando predicciones:', prediccionesRes.reason)
        toast.error('No se pudieron cargar las predicciones')
        setPredicciones([])
      }

      // Siembras — mostrar en_curso primero, si no hay ninguna mostrar todas
      if (siembrasRes.status === 'fulfilled') {
        const todas = siembrasRes.value || []
        const enCurso = todas.filter(s => s.estado === 'en_curso')
        setSiembrasDisponibles(enCurso.length > 0 ? enCurso : todas)
      } else {
        console.error('Error cargando siembras:', siembrasRes.reason)
        toast.error('No se pudieron cargar las siembras')
        setSiembrasDisponibles([])
      }

    } catch (error) {
      console.error('Error inesperado al cargar datos:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerarPrediccion = async () => {
    try {
      // Generar valores simulados garantizando que se cumplan los constraints de la BD:
      // - rendimiento_min <= rendimiento_estimado <= rendimiento_max
      // - intervalo_confianza entre 0 y 99.99
      // - NUMERIC(6,2): máximo 9999.99
      const estimado  = parseFloat((Math.random() * 10 + 5).toFixed(2))   // 5.00 – 15.00
      const variacion = parseFloat((estimado * 0.15).toFixed(2))           // 15%
      const minVal    = parseFloat((estimado - variacion).toFixed(2))
      const maxVal    = parseFloat((estimado + variacion).toFixed(2))
      const confianza = parseFloat((Math.random() * 14 + 80).toFixed(2))   // 80.00 – 94.00

      await prediccionService.create({
        siembra: { idSiembra: parseInt(selectedSiembra) },
        modelo: { idModelo: parseInt(selectedModel) },
        fechaPrediccion: new Date().toISOString().split('T')[0],
        fechaClimaInicio,
        fechaClimaFin,
        fuenteClima,
        rendimientoEstimadoTonHa: estimado,
        rendimientoMinTonHa: minVal,
        rendimientoMaxTonHa: maxVal,
        intervaloConfianzaPct: confianza,
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
      const msg = error?.response?.data || error?.message || 'Error desconocido'
      toast.error(`Error: ${msg}`)
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

  const handleEditar = (prediccion) => {
    setModalEditar(prediccion)
  }

  const handleCambiarEstado = (prediccion) => {
    setModalEstado(prediccion)
  }

  const handleEliminar = (prediccion) => {
    setModalEliminar(prediccion)
  }

  const confirmarEditar = async (id, payload) => {
    try {
      const actualizada = await prediccionService.update(id, payload)
      setPredicciones(predicciones.map(p =>
        p.idPrediccion === id ? actualizada : p
      ))
      toast.success('Predicción actualizada correctamente')
      setModalEditar(null)
    } catch (error) {
      console.error('Error al editar predicción:', error)
      toast.error('Error al actualizar la predicción')
      throw error
    }
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
      // Soft delete: poner estado "inactiva" en lugar de borrar
      const payload = { ...modalEliminar, estado: 'inactiva' }
      await prediccionService.update(modalEliminar.idPrediccion, payload)
      setPredicciones(predicciones.map(p =>
        p.idPrediccion === modalEliminar.idPrediccion ? { ...p, estado: 'inactiva' } : p
      ))
      toast.success('Predicción desactivada correctamente')
      setModalEliminar(null)
    } catch (error) {
      console.error('Error al desactivar predicción:', error)
      toast.error('Error al desactivar la predicción')
    }
  }

  const handleRestaurar = async (prediccion) => {
    try {
      const payload = { ...prediccion, estado: 'activa' }
      await prediccionService.update(prediccion.idPrediccion, payload)
      setPredicciones(predicciones.map(p =>
        p.idPrediccion === prediccion.idPrediccion ? { ...p, estado: 'activa' } : p
      ))
      toast.success('Predicción restaurada y marcada como activa')
    } catch (error) {
      console.error('Error al restaurar predicción:', error)
      toast.error('Error al restaurar la predicción')
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
            onEditar={handleEditar}
            onCambiarEstado={handleCambiarEstado}
            onEliminar={handleEliminar}
            onRestaurar={handleRestaurar}
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

      <ModalEditar
        prediccion={modalEditar}
        siembrasDisponibles={siembrasDisponibles}
        onConfirmar={confirmarEditar}
        onClose={() => setModalEditar(null)}
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
