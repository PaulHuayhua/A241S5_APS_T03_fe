import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Droplets, Target, BarChart3, Download, Loader2 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'
import { cosechaService, prediccionService } from '../services'

// Datos calculados a partir de COSECHA, COSTO_CAMPANA, PREDICCION_RENDIMIENTO, etc.
const eficienciaData = {
  economica: {
    roi: 142.5, // (Ingresos - Costos) / Costos * 100
    margenNeto: 58.7, // (Ingresos - Costos) / Ingresos * 100
    costoProduccion: 2850, // Total COSTO_CAMPANA / area_cosechada_ha
    ingresoPromedio: 6750, // (produccion_kg * precio_venta_kg) / area_cosechada_ha
    tendencia: 'up'
  },
  productiva: {
    rendimientoReal: 18.2, // Promedio rendimiento_ton_ha de COSECHA
    rendimientoEsperado: 17.5, // Promedio rendimiento_estimado_ton_ha de PREDICCION
    precision: 96.0, // (1 - |real - esperado| / esperado) * 100
    eficiencia: 104.0, // (rendimientoReal / rendimientoEsperado) * 100
    tendencia: 'up'
  },
  riego: {
    eficienciaPromedio: 82.5, // Promedio ponderado según CAT_SISTEMA_RIEGO
    consumoAgua: 4500, // m³/ha estimado
    ahorroVsTradicional: 45, // % vs gravedad
    sistemaOptimo: 'Goteo'
  },
  recursos: {
    eficienciaInsumos: 88.5, // Relación producción vs insumos aplicados
    aprovechamientoArea: 94.2, // area_cosechada / area_sembrada * 100
    densidadOptima: 92.0, // Comparación con densidad recomendada
    perdidas: 5.8 // % de pérdidas
  }
}

// Datos históricos para gráficos
const evolucionROI = [
  { mes: 'Ene', roi: 125, margen: 52 },
  { mes: 'Feb', roi: 132, margen: 54 },
  { mes: 'Mar', roi: 128, margen: 53 },
  { mes: 'Abr', roi: 135, margen: 56 },
  { mes: 'May', roi: 138, margen: 57 },
  { mes: 'Jun', roi: 142, margen: 58 }
]

const rendimientoPorCultivo = [
  { cultivo: 'Maíz', real: 18.5, esperado: 17.8, eficiencia: 104 },
  { cultivo: 'Soja', real: 3.2, esperado: 3.4, eficiencia: 94 },
  { cultivo: 'Trigo', real: 4.8, esperado: 4.6, eficiencia: 104 },
  { cultivo: 'Arroz', real: 7.2, esperado: 7.5, eficiencia: 96 }
]

const eficienciaPorParcela = [
  { parcela: 'El Dorado', productiva: 104, economica: 137, riego: 92 },
  { parcela: 'San Isidro', productiva: 94, economica: 129, riego: 88 },
  { parcela: 'La Esperanza', productiva: 104, economica: 153, riego: 75 },
  { parcela: 'Los Pinos', productiva: 98, economica: 141, riego: 90 }
]

const distribucionCostos = [
  { categoria: 'Insumos', valor: 45, color: '#3b82f6' },
  { categoria: 'Mano de obra', valor: 30, color: '#22c55e' },
  { categoria: 'Maquinaria', valor: 15, color: '#f59e0b' },
  { categoria: 'Servicios', valor: 10, color: '#8b5cf6' }
]

// Datos de campañas para la tabla
const campanasData = [
  {
    id_siembra: 1,
    parcela: 'El Dorado',
    cultivo: 'Maíz DK 72-10',
    area_ha: 12.5,
    fecha_siembra: '2023-10-12',
    fecha_cosecha: '2024-04-15',
    rendimiento_real: 18.5,
    rendimiento_esperado: 17.8,
    eficiencia_productiva: 104.0,
    costos_totales: 35625,
    ingresos_totales: 84375,
    roi: 136.8,
    margen_neto: 57.8,
    eficiencia_riego: 92
  },
  {
    id_siembra: 2,
    parcela: 'San Isidro',
    cultivo: 'Soja Asgrow 38X1',
    area_ha: 8.0,
    fecha_siembra: '2023-11-05',
    fecha_cosecha: '2024-04-20',
    rendimiento_real: 3.2,
    rendimiento_esperado: 3.4,
    eficiencia_productiva: 94.1,
    costos_totales: 22400,
    ingresos_totales: 51200,
    roi: 128.6,
    margen_neto: 56.3,
    eficiencia_riego: 88
  },
  {
    id_siembra: 3,
    parcela: 'La Esperanza',
    cultivo: 'Trigo Baguette 31',
    area_ha: 15.0,
    fecha_siembra: '2023-09-20',
    fecha_cosecha: '2024-03-25',
    rendimiento_real: 4.8,
    rendimiento_esperado: 4.6,
    eficiencia_productiva: 104.3,
    costos_totales: 42750,
    ingresos_totales: 108000,
    roi: 152.6,
    margen_neto: 60.4,
    eficiencia_riego: 75
  },
  {
    id_siembra: 4,
    parcela: 'Los Pinos',
    cultivo: 'Maíz Pioneer 1780',
    area_ha: 10.0,
    fecha_siembra: '2023-10-15',
    fecha_cosecha: '2024-04-18',
    rendimiento_real: 17.2,
    rendimiento_esperado: 17.5,
    eficiencia_productiva: 98.3,
    costos_totales: 28500,
    ingresos_totales: 68800,
    roi: 141.4,
    margen_neto: 58.6,
    eficiencia_riego: 90
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
    minimumFractionDigits: 0
  }).format(valor)
}

export default function Eficiencia() {
  const [loading, setLoading] = useState(true)
  const [cosechas, setCosechas] = useState([])
  const [predicciones, setPredicciones] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [filtroPeriodo, setFiltroPeriodo] = useState('6meses')

  // Cargar datos del backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [cosechasRes, prediccionesRes] = await Promise.all([
          cosechaService.getAll(),
          prediccionService.getAll()
        ])
        
        setCosechas(cosechasRes)
        setPredicciones(prediccionesRes)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error('Error al cargar datos de eficiencia')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Calcular métricas a partir de datos reales
  const calcularMetricas = () => {
    if (cosechas.length === 0) return eficienciaData

    const rendimientoReal = cosechas.reduce((sum, c) => sum + (c.rendimientoTonHa || 0), 0) / cosechas.length
    const rendimientoEsperado = predicciones.length > 0
      ? predicciones.reduce((sum, p) => sum + (p.rendimientoEstimadoTonHa || 0), 0) / predicciones.length
      : rendimientoReal

    const eficiencia = rendimientoEsperado > 0 ? (rendimientoReal / rendimientoEsperado) * 100 : 100
    const precision = 100 - Math.abs((rendimientoReal - rendimientoEsperado) / rendimientoEsperado * 100)

    return {
      ...eficienciaData,
      productiva: {
        ...eficienciaData.productiva,
        rendimientoReal: rendimientoReal.toFixed(2),
        rendimientoEsperado: rendimientoEsperado.toFixed(2),
        eficiencia: eficiencia.toFixed(1),
        precision: precision.toFixed(1)
      }
    }
  }

  const metricas = calcularMetricas()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de eficiencia...</p>
        </div>
      </div>
    )
  }

  const handleExportar = () => {
    // Lógica de exportación
    console.log('Exportando datos de eficiencia...')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eficiencia Operativa</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Análisis de rendimiento económico, productivo y uso de recursos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <option value="1mes">Último mes</option>
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="1año">Último año</option>
          </select>
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-4 gap-5">
        {/* ROI */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ROI Promedio</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {eficienciaData.economica.roi}%
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-gray-600">+8.2% vs. período anterior</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
              <DollarSign className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Eficiencia Productiva */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Eficiencia Productiva</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {metricas.productiva.eficiencia}%
              </p>
              <p className="text-xs text-gray-600 mt-2">Precisión ML: {metricas.productiva.precision}%</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
              <Target className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Eficiencia de Riego */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Eficiencia de Riego</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {eficienciaData.riego.eficienciaPromedio}%
              </p>
              <p className="text-xs text-gray-600 mt-2">Ahorro: {eficienciaData.riego.ahorroVsTradicional}% vs tradicional</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-50 group-hover:scale-110 transition-all duration-300">
              <Droplets className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Margen Neto */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Margen Neto</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {eficienciaData.economica.margenNeto}%
              </p>
              <p className="text-xs text-gray-600 mt-2">Costo/ha: {formatearMoneda(eficienciaData.economica.costoProduccion)}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 group-hover:scale-110 transition-all duration-300">
              <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Métricas Secundarias */}
      <div className="grid grid-cols-12 gap-5">
        {/* Columna Izquierda - Gráficos */}
        <div className="col-span-8 space-y-5">
          {/* Evolución ROI y Margen */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Evolución Económica</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">ROI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Margen</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={evolucionROI}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px',
                    padding: '6px 10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="ROI (%)"
                  dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="margen" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Margen Neto (%)"
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rendimiento por Cultivo */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Rendimiento por Cultivo</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Real</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <span className="text-gray-600">Esperado</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={rendimientoPorCultivo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="cultivo" 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px',
                    padding: '6px 10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Bar dataKey="real" fill="#22c55e" name="Real (ton/ha)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="esperado" fill="#cbd5e1" name="Esperado (ton/ha)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparación de Eficiencia por Parcela */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Comparación por Parcela</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Productiva</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Económica</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                  <span className="text-gray-600">Riego</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={eficienciaPorParcela}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="parcela" 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px',
                    padding: '6px 10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="productiva" fill="#22c55e" name="Efic. Productiva (%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="economica" fill="#3b82f6" name="Efic. Económica (ROI %)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="riego" fill="#06b6d4" name="Efic. Riego (%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Columna Derecha - Métricas y Distribución */}
        <div className="col-span-4 space-y-5">
          {/* Distribución de Costos */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Distribución de Costos</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={distribucionCostos}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={1}
                  dataKey="valor"
                >
                  {distribucionCostos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px',
                    padding: '6px 10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {distribucionCostos.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.categoria}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.valor}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Métricas Adicionales */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Métricas de Recursos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs text-gray-600">Eficiencia Insumos</span>
                <span className="text-sm font-bold text-gray-900">{eficienciaData.recursos.eficienciaInsumos}%</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs text-gray-600">Aprovechamiento Área</span>
                <span className="text-sm font-bold text-gray-900">{eficienciaData.recursos.aprovechamientoArea}%</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs text-gray-600">Densidad Óptima</span>
                <span className="text-sm font-bold text-gray-900">{eficienciaData.recursos.densidadOptima}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Pérdidas</span>
                <span className="text-sm font-bold text-red-600">{eficienciaData.recursos.perdidas}%</span>
              </div>
            </div>
          </div>

          {/* Resumen Económico */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumen Económico</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs text-gray-600">Costo/ha Promedio</span>
                <span className="text-sm font-bold text-gray-900">{formatearMoneda(eficienciaData.economica.costoProduccion)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs text-gray-600">Ingreso/ha Promedio</span>
                <span className="text-sm font-bold text-green-600">{formatearMoneda(eficienciaData.economica.ingresoPromedio)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Sistema Riego Óptimo</span>
                <span className="text-sm font-bold text-gray-900">{eficienciaData.riego.sistemaOptimo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Campañas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Detalle por Campaña</h3>
            <p className="text-xs text-gray-500 mt-0.5">{campanasData.length} campañas analizadas</p>
          </div>
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <option value="todas">Todas las campañas</option>
            <option value="activas">Solo activas</option>
            <option value="finalizadas">Finalizadas</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Parcela</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cultivo</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Área (ha)</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rendimiento</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Efic. Prod.</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">ROI</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Margen</span>
                </th>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Efic. Riego</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {campanasData.map((campana) => (
                <tr key={campana.id_siembra}>
                  <td className="px-6 py-3 align-middle">
                    <span className="text-sm font-semibold text-gray-900">{campana.parcela}</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <span className="text-sm text-gray-700">{campana.cultivo}</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campana.area_ha} ha</span>
                  </td>
                  <td className="px-6 py-3 align-middle">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{campana.rendimiento_real} ton/ha</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">Esp: {campana.rendimiento_esperado}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      campana.eficiencia_productiva >= 100
                        ? 'bg-green-100 text-green-800'
                        : campana.eficiencia_productiva >= 95
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {campana.eficiencia_productiva}%
                    </span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-700">{campana.roi}%</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-700">{campana.margen_neto}%</span>
                  </td>
                  <td className="px-6 py-3 align-middle whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campana.eficiencia_riego}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
