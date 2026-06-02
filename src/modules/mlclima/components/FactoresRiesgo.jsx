export default function FactoresRiesgo() {
  const factoresRiesgo = [
    { factor: 'Clima', impacto: -12, nivel: 'medio' },
    { factor: 'Plagas', impacto: -8, nivel: 'bajo' },
    { factor: 'Suelo', impacto: +5, nivel: 'positivo' },
    { factor: 'Riego', impacto: +8, nivel: 'positivo' },
  ]

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Factores de Riesgo</h3>
      <div className="space-y-3">
        {factoresRiesgo.map((factor, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${
                factor.nivel === 'positivo' ? 'bg-green-500' :
                factor.nivel === 'medio' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">{factor.factor}</span>
            </div>
            <span className={`text-sm font-bold ${
              factor.impacto > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {factor.impacto > 0 ? '+' : ''}{factor.impacto}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
