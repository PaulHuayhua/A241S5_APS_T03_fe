import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const evolucionPrecision = [
  { mes: 'Ene', precision: 82 },
  { mes: 'Feb', precision: 85 },
  { mes: 'Mar', precision: 88 },
  { mes: 'Abr', precision: 91 },
  { mes: 'May', precision: 89 },
  { mes: 'Jun', precision: 92 },
]

export default function PrediccionCharts() {
  return (
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
  )
}
