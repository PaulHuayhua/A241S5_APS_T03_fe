import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Datos históricos
const evolucionROI = [
  { mes: 'Ene', roi: 125, margen: 52 },
  { mes: 'Feb', roi: 132, margen: 54 },
  { mes: 'Mar', roi: 128, margen: 53 },
  { mes: 'Abr', roi: 135, margen: 56 },
  { mes: 'May', roi: 138, margen: 57 },
  { mes: 'Jun', roi: 142, margen: 58 }
]

const distribucionCostos = [
  { categoria: 'Insumos', valor: 45, color: '#3b82f6' },
  { categoria: 'Mano de obra', valor: 30, color: '#22c55e' },
  { categoria: 'Maquinaria', valor: 15, color: '#f59e0b' },
  { categoria: 'Servicios', valor: 10, color: '#8b5cf6' }
]

export function EvolucionEconomica({ data }) {
  // Si no hay datos, mostrar datos vacíos
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Evolución Económica</h3>
        <div className="flex items-center justify-center h-[180px] text-gray-400">
          <p className="text-sm">No hay datos históricos disponibles</p>
        </div>
      </div>
    )
  }

  return (
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
        <LineChart data={data}>
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
  )
}

export function RendimientoPorCultivo({ data }) {
  return (
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
        <BarChart data={data}>
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
  )
}

export function ComparacionParcelas({ data }) {
  return (
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
        <BarChart data={data}>
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
  )
}

export function DistribucionCostos() {
  return (
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
  )
}
