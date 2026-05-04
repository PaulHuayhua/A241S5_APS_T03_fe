import { MapPin, Plus } from 'lucide-react'

const parcelasData = [
  { id: 1, nombre: 'Parcela Norte', area: 2.5, suelo: 'Franco', riego: 'Goteo', pH: 6.5, activo: true },
  { id: 2, nombre: 'Parcela Sur', area: 3.0, suelo: 'Franco arcilloso', riego: 'Aspersión', pH: 6.8, activo: true },
  { id: 3, nombre: 'Parcela Este', area: 4.2, suelo: 'Franco arenoso', riego: 'Goteo', pH: 6.2, activo: true },
]

export default function Parcelas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parcelas</h1>
          <p className="text-gray-600 mt-1">Gestión de parcelas agrícolas</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva Parcela
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 font-medium">Total Parcelas</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 font-medium">Área Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">28.5 ha</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 font-medium">Parcelas Activas</p>
          <p className="text-2xl font-bold text-green-600 mt-2">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcelasData.map((parcela) => (
          <div key={parcela.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">{parcela.nombre}</h3>
              </div>
              <span className="badge badge-success">Activa</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Área:</span>
                <span className="font-medium text-gray-900">{parcela.area} ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo de Suelo:</span>
                <span className="font-medium text-gray-900">{parcela.suelo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sistema de Riego:</span>
                <span className="font-medium text-gray-900">{parcela.riego}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">pH del Suelo:</span>
                <span className="font-medium text-gray-900">{parcela.pH}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full btn btn-secondary text-sm">Ver Detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
