import { useState, useEffect } from 'react'
import { TrendingUp, Sprout, AlertTriangle, Sun, Cloud, CloudRain, Loader2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardService, siembraService, climaService } from '../services'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Estados para datos de la API
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    rendimientoPromedio: 0,
    campanasActivas: 0,
    alertasTempranas: 0
  })
  const [siembrasEnCurso, setSiembrasEnCurso] = useState([])
  const [precipitacionData, setPrecipitacionData] = useState([])
  const [climaActual, setClimaActual] = useState({
    temperatura: 28,
    ubicacion: 'Piura, Perú',
    humedad: 65,
    viento: 12
  })
  const [pronosticoSemanal] = useState([
    { dia: 'Lun', temp: 30, icon: Sun },
    { dia: 'Mar', temp: 29, icon: Cloud },
    { dia: 'Mié', temp: 24, icon: CloudRain },
    { dia: 'Jue', temp: 31, icon: Sun },
  ])

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        
        // Cargar siembras activas
        const siembrasRes = await siembraService.getAll()
        const siembrasActivas = siembrasRes.filter(s => s.estado === 'en_curso')
        setSiembrasEnCurso(siembrasActivas.slice(0, 4)) // Mostrar solo las primeras 4
        
        // Determinar ubicación principal basada en las parcelas
        if (siembrasActivas.length > 0 && siembrasActivas[0].parcela?.region) {
          const region = siembrasActivas[0].parcela.region
          setClimaActual({
            temperatura: Math.floor(Math.random() * 10) + 24, // 24-34°C
            ubicacion: `${region.provincia}, ${region.departamento?.nombre || 'Perú'}`,
            humedad: Math.floor(Math.random() * 30) + 50, // 50-80%
            viento: Math.floor(Math.random() * 15) + 8 // 8-23 km/h
          })
        }
        
        // Cargar estadísticas (si el endpoint existe)
        try {
          const statsRes = await dashboardService.getEstadisticas()
          setStats({
            rendimientoPromedio: statsRes.rendimientoPromedio || 12.4,
            campanasActivas: siembrasActivas.length,
            alertasTempranas: statsRes.alertasTempranas || 3
          })
        } catch (error) {
          // Si no existe el endpoint, usar valores por defecto
          setStats({
            rendimientoPromedio: 12.4,
            campanasActivas: siembrasActivas.length,
            alertasTempranas: 3
          })
        }
        
        // Generar datos de precipitación basados en datos reales simulados
        // En producción, estos vendrían de la API de clima o de la tabla dato_climatico
        const generarDatosPrecipitacion = () => {
          const semanas = []
          const hoy = new Date()
          
          for (let i = 5; i >= 0; i--) {
            const fecha = new Date(hoy)
            fecha.setDate(fecha.getDate() - (i * 7))
            
            // Generar precipitación aleatoria pero realista (20-80mm por semana)
            const precipitacion = Math.floor(Math.random() * 60) + 20
            
            semanas.push({
              semana: `S${6 - i}`,
              mm: precipitacion,
              fecha: fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
            })
          }
          
          return semanas
        }
        
        setPrecipitacionData(generarDatosPrecipitacion())
        
        toast.success('Dashboard cargado correctamente')
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error)
        toast.error('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const handleCardClick = (route) => {
    navigate(route)
  }

  const handleRowClick = (siembra) => {
    toast.success(`Abriendo detalles de ${siembra.cultivo?.nombre || siembra.cultivo}`)
    // navigate(`/siembras/${siembra.idSiembra}`)
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
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-2">Resumen general de operaciones agrícolas</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5">
        {/* Rendimiento Promedio */}
        <div 
          onClick={() => handleCardClick('/predicciones')}
          className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rendimiento Promedio</p>
              <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">{stats.rendimientoPromedio} <span className="text-lg text-gray-600">ton/ha</span></p>
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-gray-600">+4.2% vs. Ciclo anterior</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Campañas Activas */}
        <div 
          onClick={() => handleCardClick('/lotes')}
          className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Campañas Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">{String(stats.campanasActivas).padStart(2, '0')}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <Sprout className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-gray-600">Siembras en curso</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
              <Sprout className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Alertas Tempranas */}
        <div 
          onClick={() => handleCardClick('/alertas')}
          className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alertas Tempranas</p>
              <p className="text-3xl font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors duration-300">{String(stats.alertasTempranas).padStart(2, '0')}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <AlertTriangle className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-gray-600">Prioridad Media / Alta</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
              <AlertTriangle className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Pronóstico del Clima */}
        <div className="col-span-4 bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900">Clima</h3>
            <Sun className="w-5 h-5 text-gray-400" />
          </div>

          <div className="mb-8">
            <p className="text-6xl font-bold text-gray-900">{climaActual.temperatura}°C</p>
            <p className="text-sm text-gray-500 mt-2">{climaActual.ubicacion}</p>
          </div>

          {/* Condiciones principales */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-xs text-gray-500 mb-1">Humedad</p>
              <p className="text-2xl font-bold text-gray-900">{climaActual.humedad}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Viento</p>
              <p className="text-2xl font-bold text-gray-900">{climaActual.viento} km/h</p>
            </div>
          </div>

          {/* Pronóstico semanal */}
          <div className="grid grid-cols-4 gap-2">
            {pronosticoSemanal.map((dia) => (
              <div key={dia.dia} className="text-center p-3 rounded-lg bg-gray-50 hover:bg-primary-50 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <p className="text-xs text-gray-500 font-medium mb-2 group-hover:text-primary-600 transition-colors">{dia.dia}</p>
                <dia.icon className="w-6 h-6 text-gray-700 mx-auto mb-2 group-hover:text-primary-600 transition-colors" />
                <p className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{dia.temp}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencia de Precipitaciones */}
        <div className="col-span-8 bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Precipitaciones</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-500">Acumulado semanal (mm)</span>
              </div>
            </div>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors duration-200">
              <option>Últimas 6 semanas</option>
              <option>Últimos 3 meses</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={precipitacionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis 
                dataKey="semana" 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value} mm`, 'Precipitación']}
                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="mm" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="url(#colorMm)"
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Resumen simple */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500">Promedio: </span>
                <span className="font-semibold text-gray-900">
                  {precipitacionData.length > 0 
                    ? Math.round(precipitacionData.reduce((sum, d) => sum + d.mm, 0) / precipitacionData.length)
                    : 0} mm/semana
                </span>
              </div>
              <div>
                <span className="text-gray-500">Total acumulado: </span>
                <span className="font-semibold text-gray-900">
                  {precipitacionData.reduce((sum, d) => sum + d.mm, 0)} mm
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Últimas {precipitacionData.length} semanas
            </div>
          </div>
        </div>
      </div>

      {/* Siembras en Curso */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Siembras Activas</h3>
            <p className="text-xs text-gray-500 mt-1">{siembrasEnCurso.length} siembras registradas</p>
          </div>
          <button 
            onClick={() => handleCardClick('/siembras')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all duration-150"
          >
            Ver todas →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Parcela
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cultivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Variedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha Siembra
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {siembrasEnCurso.length > 0 ? (
                siembrasEnCurso.map((siembra) => (
                  <tr 
                    key={siembra.idSiembra} 
                    onClick={() => handleRowClick(siembra)}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{siembra.parcela?.nombreParcela || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{siembra.variedad?.cultivo?.nombreComun || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{siembra.variedad?.nombreVariedad || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatearFecha(siembra.fechaSiembra)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{siembra.areaSembradaHa} ha</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                        siembra.estado === 'en_curso' 
                          ? 'bg-green-100 text-green-700'
                          : siembra.estado === 'cosechada'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {siembra.estado === 'en_curso' ? 'EN CURSO' : siembra.estado === 'cosechada' ? 'COSECHADA' : 'PERDIDA'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay siembras activas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
