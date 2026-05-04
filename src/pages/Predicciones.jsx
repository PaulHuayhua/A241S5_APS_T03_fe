import { useState, useEffect } from 'react'
import { Brain, TrendingUp, Target, BarChart3, Download, X, Eye, RefreshCw, Trash2, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { prediccionService, siembraService } from '../services'

const evolucionPrecision = [
  { mes: 'Ene', precision: 82 },
  { mes: 'Feb', precision: 85 },
  { mes: 'Mar', precision: 88 },
  { mes: 'Abr', precision: 91 },
  { mes: 'May', precision: 89 },
  { mes: 'Jun', precision: 92 },
]

const factoresRiesgo = [
  { factor: 'Clima', impacto: -12, nivel: 'medio' },
  { factor: 'Plagas', impacto: -8, nivel: 'bajo' },
  { factor: 'Suelo', impacto: +5, nivel: 'positivo' },
  { factor: 'Riego', impacto: +8, nivel: 'positivo' },
]

export default function Predicciones() {
  // Estados para datos de la API
  const [loading, setLoading] = useState(true)
  const [predicciones, setPredicciones] = useState([])
  const [siembrasDisponibles, setSiembrasDisponibles] = useState([])
  
  const [selectedModel, setSelectedModel] = useState('1')
  const [selectedSiembra, setSelectedSiembra] = useState('')
  const [fechaClimaInicio, setFechaClimaInicio] = useState('')
  const [fechaClimaFin, setFechaClimaFin] = useState('')
  const [fuenteClima, setFuenteClima] = useState('SENAMHI')
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalEstado, setModalEstado] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)

  // Cargar datos al montar el componente
  useEffect(() => {
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

    cargarDatos()
  }, [])

  const handleGenerarPrediccion = async () => {
    if (!selectedSiembra || !fechaClimaInicio || !fechaClimaFin) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }
    
    if (new Date(fechaClimaInicio) > new Date(fechaClimaFin)) {
      toast.error('La fecha de inicio debe ser anterior a la fecha de fin')
      return
    }
    
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
      
      // Recargar todas las predicciones para obtener los datos completos con relaciones
      const prediccionesActualizadas = await prediccionService.getAll()
      setPredicciones(prediccionesActualizadas)
      
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
    toast.success('Exportando predicciones...')
    // Aquí iría la lógica de exportación
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

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
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
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Precisión Promedio</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">89.5%</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-gray-600">+3.2% vs. mes anterior</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
              <Brain className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Predicciones Activas</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">12</p>
              <p className="text-xs text-gray-600 mt-2">8 parcelas monitoreadas</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              <Target className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Modelos Activos</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">3</p>
              <p className="text-xs text-gray-600 mt-2">Random Forest, XGBoost, LSTM</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 group-hover:scale-110 transition-all duration-300">
              <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rendimiento Estimado</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">94.2%</p>
              <p className="text-xs text-gray-600 mt-2">Eficiencia proyectada</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Sidebar - Nueva Predicción */}
        <div className="col-span-3 space-y-5">
          {/* Nueva Predicción */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Nueva Predicción</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Siembra *
                </label>
                <select 
                  value={selectedSiembra}
                  onChange={(e) => setSelectedSiembra(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <option value="">Seleccionar siembra</option>
                  {siembrasDisponibles.map((siembra) => (
                    <option key={siembra.idSiembra} value={siembra.idSiembra}>
                      {siembra.parcela?.nombreParcela} - {siembra.variedad?.cultivo?.nombreComun}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Modelo ML *
                </label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <option value="1">Random Forest v2.1</option>
                  <option value="2">XGBoost v1.8</option>
                  <option value="3">LSTM v1.2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Fecha Inicio Clima *
                </label>
                <input 
                  type="date" 
                  value={fechaClimaInicio}
                  onChange={(e) => setFechaClimaInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none hover:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Fecha Fin Clima *
                </label>
                <input 
                  type="date" 
                  value={fechaClimaFin}
                  onChange={(e) => setFechaClimaFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none hover:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Fuente Clima
                </label>
                <select 
                  value={fuenteClima}
                  onChange={(e) => setFuenteClima(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
                >
                  <option value="SENAMHI">SENAMHI</option>
                  <option value="NASA POWER">NASA POWER</option>
                  <option value="OpenWeather">OpenWeather</option>
                  <option value="Estación Local">Estación Local</option>
                </select>
              </div>

              <button 
                onClick={handleGenerarPrediccion}
                className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all text-sm font-medium"
              >
                Generar Predicción
              </button>
            </div>
          </div>

          {/* Factores de Riesgo */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Factores de Riesgo</h3>
            <div className="space-y-3">
              {factoresRiesgo.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${
                      factor.nivel === 'positivo' ? 'bg-green-500' :
                      factor.nivel === 'medio' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{factor.factor}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    factor.impacto > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {factor.impacto > 0 ? '+' : ''}{factor.impacto}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-9 space-y-5">
          {/* Historial de Predicciones */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Historial de Predicciones</h3>
                <p className="text-xs text-gray-500 mt-0.5">{predicciones.length} predicciones generadas</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportar}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left bg-gray-50 w-32">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</span>
                    </th>
                    <th className="px-6 py-3 text-left bg-gray-50 w-48">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Siembra</span>
                    </th>
                    <th className="px-6 py-3 text-left bg-gray-50 w-44">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Modelo ML</span>
                    </th>
                    <th className="px-6 py-3 text-left bg-gray-50 w-44">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rendimiento</span>
                    </th>
                    <th className="px-6 py-3 text-left bg-gray-50 w-32">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</span>
                    </th>
                    <th className="px-6 py-3 text-center bg-gray-50 w-32">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {predicciones.length > 0 ? (
                    predicciones.map((pred) => (
                      <tr key={pred.idPrediccion}>
                        <td className="px-6 py-3 whitespace-nowrap align-middle">
                          <span className="text-sm font-medium text-gray-900">{formatearFecha(pred.fechaPrediccion)}</span>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="max-w-[180px]">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{pred.siembra?.parcela?.nombreParcela || 'N/A'}</p>
                            <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">{pred.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap align-middle">
                          <span className="text-sm text-gray-700">{pred.modelo?.nombreModelo || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap align-middle">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{pred.rendimientoEstimadoTonHa} ton/ha</p>
                            <p className="text-xs text-gray-500 leading-tight mt-0.5">{pred.rendimientoMinTonHa}-{pred.rendimientoMaxTonHa}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            pred.estado === 'activa' 
                              ? 'bg-green-100 text-green-800'
                              : pred.estado === 'evaluada'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pred.estado?.charAt(0).toUpperCase() + pred.estado?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => handleVerDetalle(pred)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleCambiarEstado(pred)}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Cambiar estado"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEliminar(pred)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <Brain className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-900 font-semibold mb-1">No hay predicciones registradas</p>
                          <p className="text-sm text-gray-500 mb-4">Genera tu primera predicción usando el formulario</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* Evolución de Precisión */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Evolución de Precisión</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={evolucionPrecision}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    domain={[75, 95]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Métricas del Modelo */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Métricas del Modelo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">R² Score</span>
                  <span className="text-lg font-bold text-gray-900">0.92</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">MAE</span>
                  <span className="text-lg font-bold text-gray-900">1.24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">RMSE</span>
                  <span className="text-lg font-bold text-gray-900">1.68</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cambiar Estado */}
      {modalEstado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Estado</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Predicción: <span className="font-semibold">{modalEstado.parcela} - {modalEstado.cultivo}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Estado actual: <span className="font-semibold">{modalEstado.estado}</span>
              </p>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Nuevo Estado
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => confirmarCambioEstado('activa')}
                  className="w-full px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium text-left"
                >
                  Activa
                </button>
                <button
                  onClick={() => confirmarCambioEstado('evaluada')}
                  className="w-full px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium text-left"
                >
                  Evaluada
                </button>
                <button
                  onClick={() => confirmarCambioEstado('descartada')}
                  className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium text-left"
                >
                  Descartada
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setModalEstado(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas eliminar la predicción de <span className="font-semibold">{modalEliminar.siembra?.parcela?.nombreParcela || 'N/A'} - {modalEliminar.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => setModalEliminar(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle de Predicción */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Predicción</h3>
              <button onClick={() => setModalDetalle(null)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">ID Predicción</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{modalDetalle.idPrediccion}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Predicción</label>
                  <p className="text-sm text-gray-900 mt-1">{formatearFecha(modalDetalle.fechaPrediccion)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Parcela</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.siembra?.parcela?.nombreParcela || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Cultivo</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Modelo ML</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.modelo?.nombreModelo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fuente Clima</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.fuenteClima || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Período Climático</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatearFecha(modalDetalle.fechaClimaInicio)} a {formatearFecha(modalDetalle.fechaClimaFin)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Intervalo de Confianza</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{modalDetalle.intervaloConfianzaPct}%</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Rendimiento Estimado</label>
                  <div className="mt-2 p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-900">{modalDetalle.rendimientoEstimadoTonHa} ton/ha</p>
                    <p className="text-sm text-primary-700 mt-1">
                      Rango: {modalDetalle.rendimientoMinTonHa} - {modalDetalle.rendimientoMaxTonHa} ton/ha
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold uppercase mt-2 ${
                    modalDetalle.estado === 'activa' 
                      ? 'bg-green-100 text-green-700'
                      : modalDetalle.estado === 'evaluada'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {modalDetalle.estado}
                  </span>
                </div>
                {modalDetalle.notas && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
                    <p className="text-sm text-gray-900 mt-1">{modalDetalle.notas}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setModalDetalle(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
