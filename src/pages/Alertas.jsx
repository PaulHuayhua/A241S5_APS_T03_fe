import { Bell } from 'lucide-react'

export default function Alertas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Centro de Alertas</h1>
        <p className="text-gray-600 mt-1">Monitoreo y notificaciones del sistema</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-12 border border-gray-200 text-center">
        <Bell className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Desarrollo</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          El centro de alertas estará disponible próximamente.
        </p>
      </div>
    </div>
  )
}
