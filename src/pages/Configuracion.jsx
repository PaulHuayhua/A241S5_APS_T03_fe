import { Settings } from 'lucide-react'

export default function Configuracion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Ajustes del sistema y preferencias</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-12 border border-gray-200 text-center">
        <Settings className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Desarrollo</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          El módulo de configuración estará disponible próximamente.
        </p>
      </div>
    </div>
  )
}
