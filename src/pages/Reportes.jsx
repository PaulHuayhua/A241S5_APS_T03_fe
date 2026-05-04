import { FileText, Download, Calendar } from 'lucide-react'

const reportes = [
  {
    titulo: 'Rendimiento por Cultivo',
    descripcion: 'Análisis comparativo de rendimientos por tipo de cultivo y variedad',
    icon: '📊',
    color: 'blue'
  },
  {
    titulo: 'Análisis Económico',
    descripcion: 'Costos, ingresos y rentabilidad por campaña agrícola',
    icon: '💰',
    color: 'green'
  },
  {
    titulo: 'Precisión de Modelos ML',
    descripcion: 'Evaluación de precisión de predicciones vs resultados reales',
    icon: '🎯',
    color: 'purple'
  },
  {
    titulo: 'Análisis Climático',
    descripcion: 'Tendencias climáticas y su impacto en los cultivos',
    icon: '🌤️',
    color: 'cyan'
  },
  {
    titulo: 'Factores de Riesgo',
    descripcion: 'Identificación y análisis de riesgos por región',
    icon: '⚠️',
    color: 'yellow'
  },
  {
    titulo: 'Recomendaciones',
    descripcion: 'Historial de recomendaciones y acciones tomadas',
    icon: '📋',
    color: 'indigo'
  },
]

export default function Reportes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">Generación de reportes y análisis estadísticos</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input type="date" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input type="date" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
            <select className="input">
              <option>Todas las regiones</option>
              <option>Cusco</option>
              <option>Junín</option>
              <option>Arequipa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportes.map((reporte, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{reporte.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{reporte.titulo}</h3>
                <p className="text-sm text-gray-600">{reporte.descripcion}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 btn btn-primary text-sm flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Generar
              </button>
              <button className="btn btn-secondary text-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Reporte de Rendimiento - Abril 2024</p>
                  <p className="text-xs text-gray-500">Generado el 20/04/2024</p>
                </div>
              </div>
              <button className="btn btn-secondary text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
