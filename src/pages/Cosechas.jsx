import { useState } from 'react'
import { Plus, Search, Filter, Eye, Download, X, Edit2, Trash2, ChevronRight, Check, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Datos basados en la tabla COSECHA del schema
// Campos: id_cosecha, id_siembra, id_usuario, fecha_cosecha, area_cosechada_ha, produccion_kg,
// rendimiento_ton_ha, humedad_pct, calidad_grado, metodo_medicion, precio_venta_kg, canal_venta, notas
const cosechasData = [
  {
    id_cosecha: 1,
    id_siembra: 1,
    id_usuario: 1,
    siembra: 'El Dorado - Maíz DK 72-10',
    parcela: 'El Dorado',
    cultivo: 'Maíz DK 72-10',
    fecha_cosecha: '2024-04-15',
    area_cosechada_ha: 12.5,
    produccion_kg: 231250,
    rendimiento_ton_ha: 18.5,
    humedad_pct: 14.5,
    calidad_grado: 'Primera',
    metodo_medicion: 'bascula',
    precio_venta_kg: 1.20,
    canal_venta: 'Mercado Mayorista',
    notas: 'Cosecha exitosa, buena calidad'
  },
  {
    id_cosecha: 2,
    id_siembra: 2,
    id_usuario: 1,
    siembra: 'San Isidro - Soja Asgrow 38X1',
    parcela: 'San Isidro',
    cultivo: 'Soja Asgrow 38X1',
    fecha_cosecha: '2024-04-20',
    area_cosechada_ha: 8.0,
    produccion_kg: 25600,
    rendimiento_ton_ha: 3.2,
    humedad_pct: 12.0,
    calidad_grado: 'Primera',
    metodo_medicion: 'bascula',
    precio_venta_kg: 2.50,
    canal_venta: 'Exportación',
    notas: null
  },
  {
    id_cosecha: 3,
    id_siembra: 3,
    id_usuario: 1,
    siembra: 'La Esperanza - Trigo Baguette 31',
    parcela: 'La Esperanza',
    cultivo: 'Trigo Baguette 31',
    fecha_cosecha: '2024-03-25',
    area_cosechada_ha: 15.0,
    produccion_kg: 72000,
    rendimiento_ton_ha: 4.8,
    humedad_pct: 13.5,
    calidad_grado: 'Primera',
    metodo_medicion: 'bascula',
    precio_venta_kg: 1.50,
    canal_venta: 'Molino Local',
    notas: 'Excelente calidad de grano'
  },
  {
    id_cosecha: 4,
    id_siembra: 4,
    id_usuario: 1,
    siembra: 'Los Pinos - Maíz Pioneer 1780',
    parcela: 'Los Pinos',
    cultivo: 'Maíz Pioneer 1780',
    fecha_cosecha: '2024-04-18',
    area_cosechada_ha: 10.0,
    produccion_kg: 172000,
    rendimiento_ton_ha: 17.2,
    humedad_pct: 15.0,
    calidad_grado: 'Segunda',
    metodo_medicion: 'bascula',
    precio_venta_kg: 1.10,
    canal_venta: 'Mercado Local',
    notas: 'Afectado por lluvias tardías'
  }
]

// Siembras disponibles para cosechar (estado: en_curso)
const siembrasDisponibles = [
  { 
    id_siembra: 5, 
    codigo: 'SIEMBRA-2024-005',
    parcela: 'Valle Verde', 
    cultivo: 'Maíz', 
    variedad: 'DK 72-10',
    area_sembrada_ha: 15.0,
    fecha_siembra: '2023-11-10',
    dias_transcurridos: 157,
    ciclo_esperado: 150,
    estado_fenologico: 'Madurez fisiológica'
  },
  { 
    id_siembra: 6, 
    codigo: 'SIEMBRA-2024-006',
    parcela: 'Campo Alto', 
    cultivo: 'Trigo', 
    variedad: 'Baguette 31',
    area_sembrada_ha: 20.0,
    fecha_siembra: '2023-10-05',
    dias_transcurridos: 192,
    ciclo_esperado: 180,
    estado_fenologico: 'Listo para cosecha'
  },
  { 
    id_siembra: 7, 
    codigo: 'SIEMBRA-2024-007',
    parcela: 'Loma Linda', 
    cultivo: 'Soja', 
    variedad: 'Asgrow 38X1',
    area_sembrada_ha: 12.0,
    fecha_siembra: '2023-12-01',
    dias_transcurridos: 136,
    ciclo_esperado: 130,
    estado_fenologico: 'Madurez comercial'
  }
]

// Función para formatear fechas
const formatearFecha = (fecha) => {
  const date = new Date(fecha + 'T00:00:00')
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const dia = date.getDate()
  const mes = meses[date.getMonth()]
  const año = date.getFullYear()
  return `${dia} ${mes} ${año}`
}

// Función para formatear moneda
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(valor)
}

// Predicciones ML simuladas (en producción vendrían de PREDICCION_RENDIMIENTO)
const prediccionesML = {
  5: { // Valle Verde - Maíz
    id_prediccion: 5,
    rendimiento_estimado: 18.2,
    rendimiento_min: 16.5,
    rendimiento_max: 19.8,
    confianza: 92,
    modelo: 'Random Forest v2.1',
    fecha_prediccion: '2024-04-10'
  },
  6: { // Campo Alto - Trigo
    id_prediccion: 6,
    rendimiento_estimado: 4.7,
    rendimiento_min: 4.2,
    rendimiento_max: 5.2,
    confianza: 88,
    modelo: 'Random Forest v2.1',
    fecha_prediccion: '2024-04-08'
  },
  7: { // Loma Linda - Soja
    id_prediccion: 7,
    rendimiento_estimado: 3.3,
    rendimiento_min: 2.9,
    rendimiento_max: 3.7,
    confianza: 85,
    modelo: 'Random Forest v2.1',
    fecha_prediccion: '2024-04-12'
  }
}

export default function Cosechas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalEditar, setModalEditar] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Estado para las cosechas (ahora es mutable)
  const [cosechas, setCosechas] = useState(cosechasData)
  
  // Estado para siembras disponibles (se actualizará al cosechar)
  const [siembrasActivas, setSiembrasActivas] = useState(siembrasDisponibles)

  const [filtros, setFiltros] = useState({
    calidad: 'todas',
    metodo: 'todos',
    fechaInicio: '',
    fechaFin: '',
    rendimientoMin: '',
    rendimientoMax: ''
  })

  const [formData, setFormData] = useState({
    id_siembra: '',
    fecha_cosecha: '',
    area_cosechada_ha: '',
    produccion_kg: '',
    humedad_pct: '',
    calidad_grado: '',
    metodo_medicion: 'bascula',
    precio_venta_kg: '',
    canal_venta: '',
    notas: '',
    rendimiento_ton_ha: ''
  })

  const clearFilters = () => {
    setFiltros({
      calidad: 'todas',
      metodo: 'todos',
      fechaInicio: '',
      fechaFin: '',
      rendimientoMin: '',
      rendimientoMax: ''
    })
  }

  const hasActiveFilters = filtros.calidad !== 'todas' || filtros.metodo !== 'todos' || 
    filtros.fechaInicio || filtros.fechaFin || filtros.rendimientoMin || filtros.rendimientoMax

  const handleExportar = () => {
    toast.success('Exportando datos de cosechas...')
  }

  const handleNuevaCosecha = () => {
    setModalNuevo(true)
    setCurrentStep(1) // Comenzar en selección de siembra
  }

  const handleNextStep = () => {
    // Validaciones por etapa
    if (currentStep === 1) {
      if (!formData.id_siembra) {
        toast.error('Seleccione una siembra para cosechar')
        return
      }
    }
    
    if (currentStep === 2) {
      if (!formData.fecha_cosecha || !formData.area_cosechada_ha || !formData.produccion_kg || !formData.metodo_medicion) {
        toast.error('Complete todos los campos requeridos')
        return
      }
      
      // Calcular rendimiento automáticamente
      const rendimiento = (formData.produccion_kg / 1000) / formData.area_cosechada_ha
      setFormData({ ...formData, rendimiento_ton_ha: rendimiento.toFixed(2) })
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGuardarCosecha = () => {
    // Obtener la siembra seleccionada
    const siembraSeleccionada = siembrasActivas.find(s => s.id_siembra === parseInt(formData.id_siembra))
    
    if (!siembraSeleccionada) {
      toast.error('Error: Siembra no encontrada')
      return
    }

    // Crear nueva cosecha con ID incremental
    const nuevaCosecha = {
      id_cosecha: cosechas.length + 1,
      id_siembra: parseInt(formData.id_siembra),
      id_usuario: 1,
      siembra: `${siembraSeleccionada.parcela} - ${siembraSeleccionada.cultivo} ${siembraSeleccionada.variedad}`,
      parcela: siembraSeleccionada.parcela,
      cultivo: `${siembraSeleccionada.cultivo} ${siembraSeleccionada.variedad}`,
      fecha_cosecha: formData.fecha_cosecha,
      area_cosechada_ha: parseFloat(formData.area_cosechada_ha),
      produccion_kg: parseFloat(formData.produccion_kg),
      rendimiento_ton_ha: parseFloat(formData.rendimiento_ton_ha),
      humedad_pct: formData.humedad_pct ? parseFloat(formData.humedad_pct) : null,
      calidad_grado: formData.calidad_grado || null,
      metodo_medicion: formData.metodo_medicion,
      precio_venta_kg: formData.precio_venta_kg ? parseFloat(formData.precio_venta_kg) : null,
      canal_venta: formData.canal_venta || null,
      notas: formData.notas || null
    }

    // Agregar la nueva cosecha al estado
    setCosechas([nuevaCosecha, ...cosechas])

    // Remover la siembra de las disponibles (ya fue cosechada)
    setSiembrasActivas(siembrasActivas.filter(s => s.id_siembra !== parseInt(formData.id_siembra)))

    toast.success('Cosecha registrada correctamente')
    
    // Resetear el modal
    setModalNuevo(false)
    setCurrentStep(1)
    setFormData({
      id_siembra: '',
      fecha_cosecha: '',
      area_cosechada_ha: '',
      produccion_kg: '',
      humedad_pct: '',
      calidad_grado: '',
      metodo_medicion: 'bascula',
      precio_venta_kg: '',
      canal_venta: '',
      notas: '',
      rendimiento_ton_ha: ''
    })
  }

  const handleVerDetalle = (cosecha) => {
    setModalDetalle(cosecha)
  }

  const handleEditar = (cosecha) => {
    setModalEditar(cosecha)
  }

  const handleEliminar = (cosecha) => {
    setModalEliminar(cosecha)
  }

  const confirmarEliminar = () => {
    // Eliminar la cosecha del estado
    setCosechas(cosechas.filter(c => c.id_cosecha !== modalEliminar.id_cosecha))
    
    // Opcional: Volver a agregar la siembra a las disponibles si se elimina la cosecha
    // (esto depende de la lógica de negocio que quieras implementar)
    
    toast.success(`Cosecha ${modalEliminar.id_cosecha} eliminada correctamente`)
    setModalEliminar(null)
  }

  // Calcular estadísticas dinámicamente
  const totalCosechas = cosechas.length
  const produccionTotal = cosechas.reduce((sum, c) => sum + c.produccion_kg, 0) / 1000 // en toneladas
  const rendimientoPromedio = cosechas.length > 0 
    ? cosechas.reduce((sum, c) => sum + c.rendimiento_ton_ha, 0) / cosechas.length 
    : 0
  const calidadPrimera = cosechas.length > 0
    ? (cosechas.filter(c => c.calidad_grado === 'Primera').length / cosechas.length) * 100
    : 0

  const siembraSeleccionada = siembrasActivas.find(s => s.id_siembra === parseInt(formData.id_siembra))
  const rendimientoCalculado = formData.produccion_kg && formData.area_cosechada_ha 
    ? ((formData.produccion_kg / 1000) / formData.area_cosechada_ha).toFixed(2)
    : 0
  const valorTotalEstimado = formData.produccion_kg && formData.precio_venta_kg
    ? formData.produccion_kg * formData.precio_venta_kg
    : 0
  
  // Obtener predicción ML para la siembra seleccionada
  const prediccionActual = formData.id_siembra ? prediccionesML[formData.id_siembra] : null

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Cosechas</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Gestión y seguimiento de cosechas realizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={handleNuevaCosecha}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Cosecha
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Cosechas</p>
          <p className="text-3xl font-bold text-gray-900">{totalCosechas}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Producción Total</p>
          <p className="text-3xl font-bold text-gray-900">{produccionTotal.toFixed(1)} Ton</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rendimiento Promedio</p>
          <p className="text-3xl font-bold text-green-600">{rendimientoPromedio.toFixed(1)} Ton/ha</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Calidad Primera</p>
          <p className="text-3xl font-bold text-blue-600">{calidadPrimera.toFixed(0)}%</p>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                Activos
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por parcela, cultivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div>
              <select 
                value={filtros.calidad}
                onChange={(e) => setFiltros({ ...filtros, calidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="todas">Todas las calidades</option>
                <option value="Primera">Primera</option>
                <option value="Segunda">Segunda</option>
                <option value="Tercera">Tercera</option>
              </select>
            </div>
            
            <div>
              <select 
                value={filtros.metodo}
                onChange={(e) => setFiltros({ ...filtros, metodo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="todos">Todos los métodos</option>
                <option value="bascula">Báscula</option>
                <option value="estimado">Estimado</option>
                <option value="sensor">Sensor</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                placeholder="Fecha inicio"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <input
                type="date"
                placeholder="Fecha fin"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Cosechas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Historial de Cosechas</h3>
          <p className="text-xs text-gray-500 mt-0.5">{cosechas.length} registros</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Siembra</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Área (ha)</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Producción</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rendimiento</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Calidad</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Método</span>
                </th>
                <th className="px-6 py-3 text-center bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {cosechas.map((cosecha) => (
                <tr key={cosecha.id_cosecha}>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{formatearFecha(cosecha.fecha_cosecha)}</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{cosecha.parcela}</p>
                      <p className="text-xs text-gray-500">{cosecha.cultivo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{cosecha.area_cosechada_ha} ha</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{(cosecha.produccion_kg / 1000).toFixed(2)} ton</p>
                      <p className="text-xs text-gray-500">{cosecha.produccion_kg.toLocaleString()} kg</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-700">{cosecha.rendimiento_ton_ha} ton/ha</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      cosecha.calidad_grado === 'Primera'
                        ? 'bg-green-100 text-green-800'
                        : cosecha.calidad_grado === 'Segunda'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {cosecha.calidad_grado}
                    </span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-700 capitalize">{cosecha.metodo_medicion}</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => handleVerDetalle(cosecha)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditar(cosecha)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEliminar(cosecha)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver Detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cosecha</h3>
              <button onClick={() => setModalDetalle(null)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">ID Cosecha</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{modalDetalle.id_cosecha}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Cosecha</label>
                  <p className="text-sm text-gray-900 mt-1">{formatearFecha(modalDetalle.fecha_cosecha)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Parcela</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.parcela}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Cultivo</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.cultivo}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Área Cosechada</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.area_cosechada_ha} ha</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Producción</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{modalDetalle.produccion_kg.toLocaleString()} kg</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Rendimiento</label>
                  <p className="text-sm font-semibold text-green-700 mt-1">{modalDetalle.rendimiento_ton_ha} ton/ha</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Humedad</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.humedad_pct}%</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Calidad</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.calidad_grado}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Método Medición</label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{modalDetalle.metodo_medicion}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Precio Venta</label>
                  <p className="text-sm text-gray-900 mt-1">{formatearMoneda(modalDetalle.precio_venta_kg)}/kg</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Canal Venta</label>
                  <p className="text-sm text-gray-900 mt-1">{modalDetalle.canal_venta}</p>
                </div>
                {modalDetalle.notas && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
                    <p className="text-sm text-gray-900 mt-1">{modalDetalle.notas}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Valor Total de Cosecha</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {formatearMoneda(modalDetalle.produccion_kg * modalDetalle.precio_venta_kg)}
                  </p>
                </div>
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

      {/* Modal Eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">
                ¿Estás seguro de que deseas eliminar la cosecha de <span className="font-semibold">{modalEliminar.parcela}</span>?
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

      {/* Modal Nueva Cosecha - 3 Etapas */}
      {modalNuevo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Registrar Nueva Cosecha</h3>
                <p className="text-xs text-gray-500 mt-0.5">Complete el proceso en 4 etapas</p>
              </div>
              <button 
                onClick={() => {
                  setModalNuevo(false)
                  setCurrentStep(1)
                  setFormData({
                    id_siembra: '',
                    fecha_cosecha: '',
                    area_cosechada_ha: '',
                    produccion_kg: '',
                    humedad_pct: '',
                    calidad_grado: '',
                    metodo_medicion: 'bascula',
                    precio_venta_kg: '',
                    canal_venta: '',
                    notas: ''
                  })
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Indicador de Pasos */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Paso 1 - Seleccionar Siembra */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 1 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
                  }`}>
                    {currentStep > 1 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-semibold ${currentStep === 1 ? 'text-white' : 'text-gray-400'}`}>1</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Seleccionar Siembra
                    </p>
                    <p className="text-xs text-gray-500">Campaña a cosechar</p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />

                {/* Paso 2 */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 2 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
                  }`}>
                    {currentStep > 2 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-semibold ${currentStep === 2 ? 'text-white' : 'text-gray-400'}`}>2</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Datos de Cosecha
                    </p>
                    <p className="text-xs text-gray-500">Producción y calidad</p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />

                {/* Paso 3 - Comercialización */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 3 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
                  }`}>
                    {currentStep > 3 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-semibold ${currentStep === 3 ? 'text-white' : 'text-gray-400'}`}>3</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Comercialización
                    </p>
                    <p className="text-xs text-gray-500">Precio y canal</p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />

                {/* Paso 4 - Evaluación y Predicción */}
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= 4 ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
                  }`}>
                    <span className={`text-sm font-semibold ${currentStep === 4 ? 'text-white' : 'text-gray-400'}`}>4</span>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-semibold ${currentStep >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Evaluación
                    </p>
                    <p className="text-xs text-gray-500">Real vs Predicción</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido por Etapa */}
            <div className="p-6">
              {/* ETAPA 1: Seleccionar Siembra */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h4 className="text-base font-semibold text-gray-900">Siembras Listas para Cosechar</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {siembrasActivas.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No hay siembras disponibles para cosechar</p>
                        <p className="text-gray-400 text-xs mt-1">Todas las siembras han sido cosechadas</p>
                      </div>
                    ) : (
                      siembrasActivas.map((siembra) => (
                      <label
                        key={siembra.id_siembra}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.id_siembra === siembra.id_siembra.toString()
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="siembra"
                            value={siembra.id_siembra}
                            checked={formData.id_siembra === siembra.id_siembra.toString()}
                            onChange={(e) => setFormData({ ...formData, id_siembra: e.target.value })}
                            className="mt-1 w-4 h-4 text-primary-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{siembra.codigo}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {siembra.parcela} • {siembra.cultivo} ({siembra.variedad})
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{siembra.area_sembrada_ha} ha</p>
                                <p className="text-xs text-gray-500">{siembra.dias_transcurridos} días</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${
                                  siembra.dias_transcurridos >= siembra.ciclo_esperado ? 'bg-green-500' : 'bg-yellow-500'
                                }`}></div>
                                <span className="text-gray-600">{siembra.estado_fenologico}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">Sembrado: {formatearFecha(siembra.fecha_siembra)}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))
                    )}
                  </div>

                  {siembraSeleccionada && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-semibold text-blue-900 mb-1">Información de la Siembra</h5>
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <p className="text-blue-700">Parcela</p>
                              <p className="font-semibold text-blue-900">{siembraSeleccionada.parcela}</p>
                            </div>
                            <div>
                              <p className="text-blue-700">Cultivo</p>
                              <p className="font-semibold text-blue-900">{siembraSeleccionada.cultivo}</p>
                            </div>
                            <div>
                              <p className="text-blue-700">Área Sembrada</p>
                              <p className="font-semibold text-blue-900">{siembraSeleccionada.area_sembrada_ha} ha</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 2: Datos de Cosecha */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <h4 className="text-base font-semibold text-gray-900">Datos de Producción y Calidad</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de Cosecha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_cosecha}
                        onChange={(e) => setFormData({ ...formData, fecha_cosecha: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Área Cosechada (ha) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.area_cosechada_ha}
                        onChange={(e) => setFormData({ ...formData, area_cosechada_ha: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                      {siembraSeleccionada && (
                        <p className="text-xs text-gray-500 mt-1">Área sembrada: {siembraSeleccionada.area_sembrada_ha} ha</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Producción Total (kg) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.produccion_kg}
                        onChange={(e) => setFormData({ ...formData, produccion_kg: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Método de Medición <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.metodo_medicion}
                        onChange={(e) => setFormData({ ...formData, metodo_medicion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="bascula">Báscula</option>
                        <option value="estimado">Estimado</option>
                        <option value="sensor">Sensor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Humedad (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.humedad_pct}
                        onChange={(e) => setFormData({ ...formData, humedad_pct: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Calidad del Grano
                      </label>
                      <select
                        value={formData.calidad_grado}
                        onChange={(e) => setFormData({ ...formData, calidad_grado: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="">Seleccionar calidad</option>
                        <option value="Primera">Primera</option>
                        <option value="Segunda">Segunda</option>
                        <option value="Tercera">Tercera</option>
                      </select>
                    </div>
                  </div>

                  {rendimientoCalculado > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-900">Rendimiento Calculado</p>
                          <p className="text-2xl font-bold text-green-700 mt-1">{rendimientoCalculado} ton/ha</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 3: Comercialización */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Download className="w-5 h-5 text-primary-600" />
                    <h4 className="text-base font-semibold text-gray-900">Información Comercial</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio de Venta (S/. por kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.precio_venta_kg}
                        onChange={(e) => setFormData({ ...formData, precio_venta_kg: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Canal de Venta
                      </label>
                      <select
                        value={formData.canal_venta}
                        onChange={(e) => setFormData({ ...formData, canal_venta: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="">Seleccionar canal</option>
                        <option value="Mercado Local">Mercado Local</option>
                        <option value="Mercado Mayorista">Mercado Mayorista</option>
                        <option value="Exportación">Exportación</option>
                        <option value="Molino Local">Molino Local</option>
                        <option value="Industria">Industria</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notas Adicionales
                      </label>
                      <textarea
                        value={formData.notas}
                        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        placeholder="Observaciones sobre la cosecha..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Resumen Final */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Resumen de Cosecha</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parcela:</span>
                          <span className="font-semibold text-gray-900">{siembraSeleccionada?.parcela}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Área cosechada:</span>
                          <span className="font-semibold text-gray-900">{formData.area_cosechada_ha} ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Producción:</span>
                          <span className="font-semibold text-gray-900">{(formData.produccion_kg / 1000).toFixed(2)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rendimiento:</span>
                          <span className="font-semibold text-green-700">{rendimientoCalculado} ton/ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calidad:</span>
                          <span className="font-semibold text-gray-900">{formData.calidad_grado || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="text-sm font-semibold text-green-900 mb-3">Valor Estimado</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Precio/kg:</span>
                          <span className="font-semibold text-green-900">
                            {formData.precio_venta_kg ? formatearMoneda(formData.precio_venta_kg) : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Canal:</span>
                          <span className="font-semibold text-green-900">{formData.canal_venta || '-'}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-green-300">
                          <div className="flex justify-between items-center">
                            <span className="text-green-700 font-semibold">Valor Total:</span>
                            <span className="text-xl font-bold text-green-700">
                              {valorTotalEstimado > 0 ? formatearMoneda(valorTotalEstimado) : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 4: Evaluación y Predicción */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                      <TrendingUp className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Evaluación de Predicción</h4>
                    <p className="text-sm text-gray-600">Comparación entre rendimiento real y predicción del modelo ML</p>
                  </div>

                  {!prediccionActual ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">No hay predicción disponible</h5>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        No se encontró una predicción ML para esta siembra. La evaluación de precisión no está disponible.
                      </p>
                      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl mx-auto">
                        <h6 className="text-sm font-semibold text-gray-900 mb-3">Resumen de Cosecha</h6>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-left">
                            <p className="text-gray-600">Parcela:</p>
                            <p className="font-semibold text-gray-900">{siembraSeleccionada?.parcela}</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Cultivo:</p>
                            <p className="font-semibold text-gray-900">{siembraSeleccionada?.cultivo}</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Área cosechada:</p>
                            <p className="font-semibold text-gray-900">{formData.area_cosechada_ha} ha</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Producción:</p>
                            <p className="font-semibold text-gray-900">{(formData.produccion_kg / 1000).toFixed(2)} ton</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Rendimiento:</p>
                            <p className="font-semibold text-green-700">{rendimientoCalculado} ton/ha</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Valor Total:</p>
                            <p className="font-bold text-green-700">
                              {valorTotalEstimado > 0 ? formatearMoneda(valorTotalEstimado) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                  siembraSeleccionada && prediccionActual && (() => {
                    const rendimientoReal = parseFloat(rendimientoCalculado) || 0
                    const diferencia = rendimientoReal - prediccionActual.rendimiento_estimado
                    const porcentajeDiferencia = ((diferencia / prediccionActual.rendimiento_estimado) * 100).toFixed(1)
                    const precision = (100 - Math.abs(parseFloat(porcentajeDiferencia))).toFixed(1)
                    const dentroRango = rendimientoReal >= prediccionActual.rendimiento_min && rendimientoReal <= prediccionActual.rendimiento_max

                    return (
                      <>
                        {/* Comparación Visual */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Predicción ML */}
                          <div className="border-2 border-primary-200 rounded-lg p-5 bg-primary-50">
                            <div className="flex items-center gap-2 mb-4">
                              <TrendingUp className="w-5 h-5 text-primary-600" />
                              <h5 className="text-sm font-bold text-primary-900">Predicción del Modelo</h5>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-primary-700 mb-1">Rendimiento Estimado</p>
                                <p className="text-3xl font-bold text-primary-900">{prediccionActual.rendimiento_estimado}</p>
                                <p className="text-sm text-primary-600">ton/ha</p>
                              </div>
                              <div className="pt-3 border-t border-primary-200">
                                <p className="text-xs text-primary-700 mb-1">Rango Esperado</p>
                                <p className="text-sm font-semibold text-primary-900">
                                  {prediccionActual.rendimiento_min} - {prediccionActual.rendimiento_max} ton/ha
                                </p>
                              </div>
                              <div className="pt-3 border-t border-primary-200">
                                <p className="text-xs text-primary-700 mb-1">Confianza del Modelo</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-primary-200 rounded-full h-2">
                                    <div 
                                      className="bg-primary-600 h-2 rounded-full" 
                                      style={{ width: `${prediccionActual.confianza}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-bold text-primary-900">{prediccionActual.confianza}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Rendimiento Real */}
                          <div className="border-2 border-green-200 rounded-lg p-5 bg-green-50">
                            <div className="flex items-center gap-2 mb-4">
                              <Check className="w-5 h-5 text-green-600" />
                              <h5 className="text-sm font-bold text-green-900">Rendimiento Real</h5>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-green-700 mb-1">Rendimiento Obtenido</p>
                                <p className="text-3xl font-bold text-green-900">{rendimientoReal.toFixed(2)}</p>
                                <p className="text-sm text-green-600">ton/ha</p>
                              </div>
                              <div className="pt-3 border-t border-green-200">
                                <p className="text-xs text-green-700 mb-1">Diferencia</p>
                                <p className={`text-lg font-bold ${diferencia >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                                  {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(2)} ton/ha
                                  <span className="text-sm ml-2">({porcentajeDiferencia >= 0 ? '+' : ''}{porcentajeDiferencia}%)</span>
                                </p>
                              </div>
                              <div className="pt-3 border-t border-green-200">
                                <p className="text-xs text-green-700 mb-1">Estado</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  dentroRango 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {dentroRango ? 'Dentro del rango esperado' : 'Fuera del rango esperado'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Métricas de Evaluación */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Precisión del Modelo</p>
                            <p className={`text-2xl font-bold ${
                              precision >= 90 ? 'text-green-600' : 
                              precision >= 80 ? 'text-blue-600' : 
                              'text-orange-600'
                            }`}>
                              {precision}%
                            </p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Error Absoluto</p>
                            <p className="text-2xl font-bold text-gray-900">{Math.abs(diferencia).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">ton/ha</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Modelo Utilizado</p>
                            <p className="text-sm font-bold text-gray-900">{prediccionActual.modelo}</p>
                            <p className="text-xs text-gray-500">Predicción: {formatearFecha(prediccionActual.fecha_prediccion)}</p>
                          </div>
                        </div>

                        {/* Análisis y Recomendaciones */}
                        <div className={`border-2 rounded-lg p-5 ${
                          precision >= 90 ? 'bg-green-50 border-green-200' :
                          precision >= 80 ? 'bg-blue-50 border-blue-200' :
                          'bg-orange-50 border-orange-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              precision >= 90 ? 'text-green-600' :
                              precision >= 80 ? 'text-blue-600' :
                              'text-orange-600'
                            }`} />
                            <div>
                              <h5 className={`text-sm font-bold mb-2 ${
                                precision >= 90 ? 'text-green-900' :
                                precision >= 80 ? 'text-blue-900' :
                                'text-orange-900'
                              }`}>
                                {precision >= 90 ? 'Excelente Precisión' :
                                 precision >= 80 ? 'Buena Precisión' :
                                 'Precisión Moderada'}
                              </h5>
                              <p className={`text-sm ${
                                precision >= 90 ? 'text-green-800' :
                                precision >= 80 ? 'text-blue-800' :
                                'text-orange-800'
                              }`}>
                                {precision >= 90 
                                  ? 'El modelo ha demostrado una precisión excelente. Los datos reales coinciden muy bien con la predicción, lo que indica que el modelo está bien calibrado para este tipo de cultivo y condiciones.'
                                  : precision >= 80
                                  ? 'El modelo ha mostrado una buena precisión. Hay una diferencia aceptable entre la predicción y los datos reales. Se recomienda continuar recopilando datos para mejorar futuras predicciones.'
                                  : 'La predicción tiene una desviación significativa respecto a los datos reales. Se recomienda revisar los parámetros del modelo y considerar factores adicionales que puedan haber influido en el rendimiento real.'
                                }
                              </p>
                              {!dentroRango && (
                                <p className="text-sm text-orange-800 mt-2">
                                  <strong>Nota:</strong> El rendimiento real está fuera del rango esperado. Esto puede deberse a factores climáticos, manejo del cultivo, o eventos imprevistos durante el ciclo de crecimiento.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Resumen Final Completo */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                          <h5 className="text-base font-bold text-gray-900 mb-4">Resumen Final de Cosecha</h5>
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <h6 className="text-xs font-semibold text-gray-500 uppercase mb-3">Información General</h6>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Parcela:</span>
                                  <span className="font-semibold text-gray-900">{siembraSeleccionada.parcela}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Cultivo:</span>
                                  <span className="font-semibold text-gray-900">{siembraSeleccionada.cultivo}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fecha:</span>
                                  <span className="font-semibold text-gray-900">{formatearFecha(formData.fecha_cosecha)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="text-xs font-semibold text-gray-500 uppercase mb-3">Producción</h6>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Área:</span>
                                  <span className="font-semibold text-gray-900">{formData.area_cosechada_ha} ha</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Producción:</span>
                                  <span className="font-semibold text-gray-900">{(formData.produccion_kg / 1000).toFixed(2)} ton</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Calidad:</span>
                                  <span className="font-semibold text-gray-900">{formData.calidad_grado || '-'}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="text-xs font-semibold text-gray-500 uppercase mb-3">Comercialización</h6>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Precio/kg:</span>
                                  <span className="font-semibold text-gray-900">
                                    {formData.precio_venta_kg ? formatearMoneda(formData.precio_venta_kg) : '-'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Canal:</span>
                                  <span className="font-semibold text-gray-900">{formData.canal_venta || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Valor Total:</span>
                                  <span className="font-bold text-green-700">
                                    {valorTotalEstimado > 0 ? formatearMoneda(valorTotalEstimado) : '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })()
                  )}
                </div>
              )}
            </div>

            {/* Footer con Botones */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-between bg-gray-50">
              <button 
                onClick={() => {
                  setModalNuevo(false)
                  setCurrentStep(1)
                  setFormData({
                    id_siembra: '',
                    fecha_cosecha: '',
                    area_cosechada_ha: '',
                    produccion_kg: '',
                    humedad_pct: '',
                    calidad_grado: '',
                    metodo_medicion: 'bascula',
                    precio_venta_kg: '',
                    canal_venta: '',
                    notas: '',
                    rendimiento_ton_ha: ''
                  })
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button 
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Anterior
                  </button>
                )}
                {currentStep < 4 ? (
                  <button 
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button 
                    onClick={handleGuardarCosecha}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Registrar Cosecha
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
