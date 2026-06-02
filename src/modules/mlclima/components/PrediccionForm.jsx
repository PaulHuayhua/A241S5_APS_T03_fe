import { Brain } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PrediccionForm({
  siembrasDisponibles,
  selectedSiembra,
  setSelectedSiembra,
  selectedModel,
  setSelectedModel,
  fechaClimaInicio,
  setFechaClimaInicio,
  fechaClimaFin,
  setFechaClimaFin,
  fuenteClima,
  setFuenteClima,
  onGenerar
}) {
  const handleSubmit = () => {
    if (!selectedSiembra || !fechaClimaInicio || !fechaClimaFin) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }
    
    if (new Date(fechaClimaInicio) > new Date(fechaClimaFin)) {
      toast.error('La fecha de inicio debe ser anterior a la fecha de fin')
      return
    }
    
    onGenerar()
  }

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">Nueva Predicción</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Siembra *
          </label>
          <select 
            value={selectedSiembra}
            onChange={(e) => setSelectedSiembra(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="">Seleccionar siembra</option>
            {siembrasDisponibles.map((siembra) => (
              <option key={siembra.idSiembra} value={siembra.idSiembra}>
                {siembra.parcela?.nombreParcela} - {siembra.variedad?.cultivo?.nombreComun}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Modelo ML *
          </label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="1">Random Forest v2.1</option>
            <option value="2">XGBoost v1.8</option>
            <option value="3">LSTM v1.2</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Fecha Inicio Clima *
          </label>
          <input 
            type="date" 
            value={fechaClimaInicio}
            onChange={(e) => setFechaClimaInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none hover:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Fecha Fin Clima *
          </label>
          <input 
            type="date" 
            value={fechaClimaFin}
            onChange={(e) => setFechaClimaFin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none hover:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Fuente Clima
          </label>
          <select 
            value={fuenteClima}
            onChange={(e) => setFuenteClima(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="SENAMHI">SENAMHI</option>
            <option value="NASA POWER">NASA POWER</option>
            <option value="OpenWeather">OpenWeather</option>
            <option value="Estación Local">Estación Local</option>
          </select>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all text-sm font-medium"
        >
          Generar Predicción
        </button>
      </div>
    </div>
  )
}
