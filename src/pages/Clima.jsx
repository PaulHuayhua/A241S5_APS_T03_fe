import { Cloud, Droplets, Wind, Sun, AlertTriangle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ClimaMap from '../components/ClimaMap'

const datosClima = [
  { fecha: '24/04', temp_max: 18.5, temp_min: 4.2, precipitacion: 0, humedad: 65 },
  { fecha: '23/04', temp_max: 19.2, temp_min: 5.1, precipitacion: 2.5, humedad: 72 },
  { fecha: '22/04', temp_max: 17.8, temp_min: 3.8, precipitacion: 8.2, humedad: 85 },
  { fecha: '21/04', temp_max: 18.9, temp_min: 4.5, precipitacion: 0, humedad: 68 },
  { fecha: '20/04', temp_max: 19.5, temp_min: 5.2, precipitacion: 1.2, humedad: 70 },
]

const precipitacionMensual = [
  { mes: 'Ene', lluvia: 120 },
  { mes: 'Feb', lluvia: 95 },
  { mes: 'Mar', lluvia: 110 },
  { mes: 'Abr', lluvia: 45 },
]

const parcelasData = [
  { id: 1, nombre: 'Parcela Norte', lat: -13.5320, lng: -71.9675, cultivo: 'Papa', area: 2.5, estado: 'En curso' },
  { id: 2, nombre: 'Parcela Sur', lat: -13.5420, lng: -71.9575, cultivo: 'Maíz', area: 3.0, estado: 'En curso' },
  { id: 3, nombre: 'Parcela Este', lat: -13.5220, lng: -71.9775, cultivo: 'Quinua', area: 1.8, estado: 'Cosechada' },
  { id: 4, nombre: 'Parcela Oeste', lat: -13.5520, lng: -71.9475, cultivo: 'Papa', area: 2.2, estado: 'En curso' },
]

const alertasData = [
  { 
    id: 1, 
    tipo: 'Helada', 
    lat: -13.5320, 
    lng: -71.9675, 
    radio: 3000, 
    nivel: 'alto',
    descripcion: 'Riesgo de helada en próximas 48h'
  },
  { 
    id: 2, 
    tipo: 'Lluvia Intensa', 
    lat: -13.5420, 
    lng: -71.9575, 
    radio: 2500, 
    nivel: 'medio',
    descripcion: 'Precipitaciones moderadas esperadas'
  },
]

export default function Clima() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Datos Climáticos</h1>
        <p className="text-gray-600 mt-1">Monitoreo y análisis de condiciones meteorológicas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Temperatura</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">18.5°C</p>
              <p className="text-xs text-gray-500 mt-1">Máx: 19.5°C | Mín: 4.2°C</p>
            </div>
            <Sun className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Precipitación</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">2.5 mm</p>
              <p className="text-xs text-gray-500 mt-1">Acum. mes: 45 mm</p>
            </div>
            <Droplets className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Humedad</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">72%</p>
              <p className="text-xs text-gray-500 mt-1">Promedio semanal</p>
            </div>
            <Cloud className="w-10 h-10 text-gray-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Viento</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">12 km/h</p>
              <p className="text-xs text-gray-500 mt-1">Dirección: NE</p>
            </div>
            <Wind className="w-10 h-10 text-cyan-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Temperatura</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosClima}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp_max" stroke="#f59e0b" strokeWidth={2} name="Máxima" />
              <Line type="monotone" dataKey="temp_min" stroke="#3b82f6" strokeWidth={2} name="Mínima" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Precipitación Mensual</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={precipitacionMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lluvia" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mapa de Parcelas y Alertas */}
      <ClimaMap parcelas={parcelasData} alertas={alertasData} />

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas Climáticas Activas</h2>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-yellow-900">Riesgo de Helada</h3>
                  <span className="badge badge-warning">Alto</span>
                </div>
                <p className="text-sm text-yellow-800 mb-2">
                  Se esperan temperaturas bajo cero en las próximas 48 horas en la región de Cusco - Urubamba
                </p>
                <div className="flex items-center gap-4 text-xs text-yellow-700">
                  <span>📅 28-30 Abril 2024</span>
                  <span>📍 Cusco - Urubamba</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Droplets className="w-6 h-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">Precipitación Moderada</h3>
                  <span className="badge badge-info">Medio</span>
                </div>
                <p className="text-sm text-blue-800 mb-2">
                  Se pronostican lluvias moderadas que podrían afectar las labores agrícolas
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-700">
                  <span>📅 25-27 Abril 2024</span>
                  <span>📍 Junín - Huancayo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Datos Climáticos Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp. Max (°C)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp. Min (°C)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precipitación (mm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Humedad (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosClima.map((dato, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dato.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dato.temp_max}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dato.temp_min}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dato.precipitacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dato.humedad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
