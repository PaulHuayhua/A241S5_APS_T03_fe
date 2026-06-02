import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PrecipitacionChart({ data }) {
  return (
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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
              {Math.round(data.reduce((sum, d) => sum + d.mm, 0) / data.length)} mm/semana
            </span>
          </div>
          <div>
            <span className="text-gray-500">Total acumulado: </span>
            <span className="font-semibold text-gray-900">
              {data.reduce((sum, d) => sum + d.mm, 0)} mm
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Últimas {data.length} semanas
        </div>
      </div>
    </div>
  )
}
