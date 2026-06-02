import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function AlertaStatsCards({ stats }) {
  const statsData = [
    {
      icon: Bell,
      label: 'Total Alertas',
      value: stats.totalAlertas,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      icon: AlertTriangle,
      label: 'Alertas Activas',
      value: stats.alertasActivas,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-900'
    },
    {
      icon: Clock,
      label: 'Riesgo Crítico',
      value: stats.alertasCriticas,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    },
    {
      icon: CheckCircle,
      label: 'Alertas Cerradas',
      value: stats.alertasCerradas,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
