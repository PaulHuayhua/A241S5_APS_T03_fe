import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function ClimaMap({ parcelas, alertas }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Parcelas y Alertas Climáticas</h2>
      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[-13.5320, -71.9675]} // Cusco, Perú
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcadores de Parcelas */}
          {parcelas.map((parcela) => (
            <Marker key={parcela.id} position={[parcela.lat, parcela.lng]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900">{parcela.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">🌾 {parcela.cultivo}</p>
                  <p className="text-sm text-gray-600">📏 {parcela.area} ha</p>
                  {parcela.estado && (
                    <p className="text-sm text-gray-600">📊 {parcela.estado}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Círculos de Alertas */}
          {alertas.map((alerta) => (
            <Circle
              key={alerta.id}
              center={[alerta.lat, alerta.lng]}
              radius={alerta.radio}
              pathOptions={{
                color: alerta.nivel === 'alto' ? '#ef4444' : '#f59e0b',
                fillColor: alerta.nivel === 'alto' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.2,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className={`font-semibold ${alerta.nivel === 'alto' ? 'text-red-600' : 'text-yellow-600'}`}>
                    ⚠️ {alerta.tipo}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{alerta.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-2">Nivel: {alerta.nivel}</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Parcelas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full opacity-50"></div>
          <span className="text-sm text-gray-700">Alerta Alta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-50"></div>
          <span className="text-sm text-gray-700">Alerta Media</span>
        </div>
      </div>
    </div>
  )
}
