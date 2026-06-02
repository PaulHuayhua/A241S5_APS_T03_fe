import { Sun, Cloud, CloudRain } from 'lucide-react'

export default function ClimaWidget({ climaActual }) {
  const pronosticoSemanal = [
    { dia: 'Lun', temp: 30, icon: Sun },
    { dia: 'Mar', temp: 29, icon: Cloud },
    { dia: 'Mié', temp: 24, icon: CloudRain },
    { dia: 'Jue', temp: 31, icon: Sun },
  ]

  return (
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
          <div 
            key={dia.dia} 
            className="text-center p-3 rounded-lg bg-gray-50 hover:bg-primary-50 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <p className="text-xs text-gray-500 font-medium mb-2 group-hover:text-primary-600 transition-colors">
              {dia.dia}
            </p>
            <dia.icon className="w-6 h-6 text-gray-700 mx-auto mb-2 group-hover:text-primary-600 transition-colors" />
            <p className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {dia.temp}°
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
