export function MetricasRecursos({ recursos }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Métricas de Recursos</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-600">Eficiencia Insumos</span>
          <span className="text-sm font-bold text-gray-900">{recursos.eficienciaInsumos}%</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-600">Aprovechamiento Área</span>
          <span className="text-sm font-bold text-gray-900">{recursos.aprovechamientoArea}%</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-600">Densidad Óptima</span>
          <span className="text-sm font-bold text-gray-900">{recursos.densidadOptima}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Pérdidas</span>
          <span className="text-sm font-bold text-red-600">{recursos.perdidas}%</span>
        </div>
      </div>
    </div>
  )
}

export function ResumenEconomico({ economica, riego }) {
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(valor)
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumen Económico</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-600">Costo/ha Promedio</span>
          <span className="text-sm font-bold text-gray-900">{formatearMoneda(economica.costoProduccion)}</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-600">Ingreso/ha Promedio</span>
          <span className="text-sm font-bold text-green-600">{formatearMoneda(economica.ingresoPromedio)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Sistema Riego Óptimo</span>
          <span className="text-sm font-bold text-gray-900">{riego.sistemaOptimo}</span>
        </div>
      </div>
    </div>
  )
}
