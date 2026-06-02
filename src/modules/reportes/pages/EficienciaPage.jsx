import { useState, useEffect } from 'react'
import { Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  EficienciaStatsCards,
  EficienciaTable,
  EvolucionEconomica,
  RendimientoPorCultivo,
  ComparacionParcelas,
  DistribucionCostos,
  MetricasRecursos,
  ResumenEconomico
} from '../components'
import { cosechaService } from '../../gestion/services'
import { prediccionService } from '../../mlclima/services'
import { exportMultipleSheetsToExcel, formatearFechaExcel, formatearNumeroExcel } from '../../../shared/utils/exportUtils'

// Datos iniciales (fallback si no hay datos del backend)
const eficienciaDataInicial = {
  economica: {
    roi: 0,
    margenNeto: 0,
    costoProduccion: 0,
    ingresoPromedio: 0,
    tendencia: 'up'
  },
  productiva: {
    rendimientoReal: 0,
    rendimientoEsperado: 0,
    precision: 0,
    eficiencia: 0,
    tendencia: 'up'
  },
  riego: {
    eficienciaPromedio: 82.5, // Mock - no hay datos en backend
    consumoAgua: 4500,
    ahorroVsTradicional: 45,
    sistemaOptimo: 'Goteo'
  },
  recursos: {
    eficienciaInsumos: 88.5, // Mock - no hay datos en backend
    aprovechamientoArea: 94.2, // Calculado más adelante
    densidadOptima: 92.0, // Mock - no hay datos en backend
    perdidas: 5.8 // Mock - no hay datos en backend
  }
}

export default function EficienciaPageRefactored() {
  const [loading, setLoading] = useState(true)
  const [cosechas, setCosechas] = useState([])
  const [predicciones, setPredicciones] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [filtroPeriodo, setFiltroPeriodo] = useState('6meses')

  // Cargar datos del backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [cosechasRes, prediccionesRes] = await Promise.all([
          cosechaService.getAll(),
          prediccionService.getAll()
        ])
        
        setCosechas(cosechasRes || [])
        setPredicciones(prediccionesRes || [])
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error('Error al cargar datos de eficiencia')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Filtrar cosechas por período
  const filtrarPorPeriodo = (cosechas) => {
    if (!cosechas || cosechas.length === 0) return []

    const ahora = new Date()
    let fechaLimite = new Date()

    switch (filtroPeriodo) {
      case '1mes':
        fechaLimite.setMonth(ahora.getMonth() - 1)
        break
      case '3meses':
        fechaLimite.setMonth(ahora.getMonth() - 3)
        break
      case '6meses':
        fechaLimite.setMonth(ahora.getMonth() - 6)
        break
      case '1año':
        fechaLimite.setFullYear(ahora.getFullYear() - 1)
        break
      default:
        fechaLimite.setMonth(ahora.getMonth() - 6) // Default 6 meses
    }

    return cosechas.filter(cosecha => {
      const fechaCosecha = new Date(cosecha.fechaCosecha)
      return fechaCosecha >= fechaLimite && fechaCosecha <= ahora
    })
  }

  // Filtrar predicciones por período
  const filtrarPrediccionesPorPeriodo = (predicciones) => {
    if (!predicciones || predicciones.length === 0) return []

    const ahora = new Date()
    let fechaLimite = new Date()

    switch (filtroPeriodo) {
      case '1mes':
        fechaLimite.setMonth(ahora.getMonth() - 1)
        break
      case '3meses':
        fechaLimite.setMonth(ahora.getMonth() - 3)
        break
      case '6meses':
        fechaLimite.setMonth(ahora.getMonth() - 6)
        break
      case '1año':
        fechaLimite.setFullYear(ahora.getFullYear() - 1)
        break
      default:
        fechaLimite.setMonth(ahora.getMonth() - 6)
    }

    return predicciones.filter(pred => {
      const fechaPred = new Date(pred.fechaPrediccion)
      return fechaPred >= fechaLimite && fechaPred <= ahora
    })
  }

  // Aplicar filtros
  const cosechasFiltradas = filtrarPorPeriodo(cosechas)
  const prediccionesFiltradas = filtrarPrediccionesPorPeriodo(predicciones)

  // Calcular métricas a partir de datos reales del backend (con filtros aplicados)
  const calcularMetricas = () => {
    if (cosechasFiltradas.length === 0) return eficienciaDataInicial

    // Calcular rendimiento real promedio
    const rendimientoReal = cosechasFiltradas.reduce((sum, c) => 
      sum + (c.rendimientoTonHa || 0), 0
    ) / cosechasFiltradas.length

    // Calcular rendimiento esperado promedio desde predicciones
    const rendimientoEsperado = prediccionesFiltradas.length > 0
      ? prediccionesFiltradas.reduce((sum, p) => 
          sum + (p.rendimientoEstimadoTonHa || 0), 0
        ) / prediccionesFiltradas.length
      : rendimientoReal

    // Calcular eficiencia y precisión
    const eficiencia = rendimientoEsperado > 0 
      ? (rendimientoReal / rendimientoEsperado) * 100 
      : 100
    
    const precision = rendimientoEsperado > 0
      ? 100 - Math.abs((rendimientoReal - rendimientoEsperado) / rendimientoEsperado * 100)
      : 100

    // Calcular métricas económicas reales
    let costosTotales = 0
    let ingresosTotales = 0
    let areaTotal = 0
    let areaSembradaTotal = 0
    let areaCosechadaTotal = 0

    cosechasFiltradas.forEach(cosecha => {
      const areaHa = cosecha.areaCosechadaHa || cosecha.siembra?.areaSembradaHa || 0
      const produccionKg = cosecha.cantidadCosechadaKg || 0
      const precioVentaKg = 4.0 // Mock - debería venir de la base de datos
      
      areaTotal += areaHa
      areaCosechadaTotal += cosecha.areaCosechadaHa || 0
      areaSembradaTotal += cosecha.siembra?.areaSembradaHa || 0
      
      // Calcular costos e ingresos
      const costosPorHa = 2850 // Mock - debería venir de COSTO_CAMPANA
      const costos = areaHa * costosPorHa
      const ingresos = (produccionKg / 1000) * precioVentaKg * 1000
      
      costosTotales += costos
      ingresosTotales += ingresos
    })

    // Calcular ROI y Margen Neto
    const roi = costosTotales > 0 
      ? ((ingresosTotales - costosTotales) / costosTotales * 100) 
      : 0
    
    const margenNeto = ingresosTotales > 0
      ? ((ingresosTotales - costosTotales) / ingresosTotales * 100)
      : 0

    const costoProduccionPromedio = areaTotal > 0 ? costosTotales / areaTotal : 0
    const ingresoPromedio = areaTotal > 0 ? ingresosTotales / areaTotal : 0

    // Calcular aprovechamiento de área
    const aprovechamientoArea = areaSembradaTotal > 0
      ? (areaCosechadaTotal / areaSembradaTotal * 100)
      : 100

    // Calcular pérdidas
    const perdidas = 100 - aprovechamientoArea

    return {
      ...eficienciaDataInicial,
      economica: {
        ...eficienciaDataInicial.economica,
        roi: parseFloat(roi.toFixed(1)),
        margenNeto: parseFloat(margenNeto.toFixed(1)),
        costoProduccion: parseFloat(costoProduccionPromedio.toFixed(0)),
        ingresoPromedio: parseFloat(ingresoPromedio.toFixed(0))
      },
      productiva: {
        ...eficienciaDataInicial.productiva,
        rendimientoReal: parseFloat(rendimientoReal.toFixed(2)),
        rendimientoEsperado: parseFloat(rendimientoEsperado.toFixed(2)),
        eficiencia: parseFloat(eficiencia.toFixed(1)),
        precision: parseFloat(precision.toFixed(1))
      },
      recursos: {
        ...eficienciaDataInicial.recursos,
        aprovechamientoArea: parseFloat(aprovechamientoArea.toFixed(1)),
        perdidas: parseFloat(perdidas.toFixed(1))
      }
    }
  }

  // Calcular datos de rendimiento por cultivo desde cosechas reales (con filtros)
  const calcularRendimientoPorCultivo = () => {
    if (cosechasFiltradas.length === 0) {
      return [
        { cultivo: 'Maíz', real: 18.5, esperado: 17.8, eficiencia: 104 },
        { cultivo: 'Soja', real: 3.2, esperado: 3.4, eficiencia: 94 },
        { cultivo: 'Trigo', real: 4.8, esperado: 4.6, eficiencia: 104 },
        { cultivo: 'Arroz', real: 7.2, esperado: 7.5, eficiencia: 96 }
      ]
    }

    // Agrupar cosechas por cultivo
    const cultivosMap = {}
    cosechasFiltradas.forEach(cosecha => {
      const nombreCultivo = cosecha.siembra?.variedad?.cultivo?.nombreComun || 'Sin nombre'
      if (!cultivosMap[nombreCultivo]) {
        cultivosMap[nombreCultivo] = {
          cultivo: nombreCultivo,
          totalReal: 0,
          count: 0,
          esperado: 0
        }
      }
      cultivosMap[nombreCultivo].totalReal += cosecha.rendimientoTonHa || 0
      cultivosMap[nombreCultivo].count += 1
    })

    // Buscar predicciones correspondientes
    prediccionesFiltradas.forEach(pred => {
      const nombreCultivo = pred.siembra?.variedad?.cultivo?.nombreComun || 'Sin nombre'
      if (cultivosMap[nombreCultivo]) {
        cultivosMap[nombreCultivo].esperado += pred.rendimientoEstimadoTonHa || 0
      }
    })

    // Convertir a array y calcular promedios
    return Object.values(cultivosMap).map(item => {
      const real = item.totalReal / item.count
      const esperado = item.esperado / item.count || real
      const eficiencia = esperado > 0 ? (real / esperado) * 100 : 100
      
      return {
        cultivo: item.cultivo,
        real: parseFloat(real.toFixed(2)),
        esperado: parseFloat(esperado.toFixed(2)),
        eficiencia: parseFloat(eficiencia.toFixed(0))
      }
    })
  }

  // Calcular datos de eficiencia por parcela (con filtros)
  const calcularEficienciaPorParcela = () => {
    if (cosechasFiltradas.length === 0) {
      return [
        { parcela: 'El Dorado', productiva: 104, economica: 137, riego: 92 },
        { parcela: 'San Isidro', productiva: 94, economica: 129, riego: 88 },
        { parcela: 'La Esperanza', productiva: 104, economica: 153, riego: 75 },
        { parcela: 'Los Pinos', productiva: 98, economica: 141, riego: 90 }
      ]
    }

    // Agrupar por parcela
    const parcelasMap = {}
    cosechasFiltradas.forEach(cosecha => {
      const nombreParcela = cosecha.siembra?.parcela?.nombreParcela || 'Sin nombre'
      if (!parcelasMap[nombreParcela]) {
        parcelasMap[nombreParcela] = {
          parcela: nombreParcela,
          productiva: 0,
          economica: 0,
          riego: 85
        }
      }
      
      const rendimientoReal = cosecha.rendimientoTonHa || 0
      const prediccion = prediccionesFiltradas.find(p => 
        p.siembra?.idSiembra === cosecha.siembra?.idSiembra
      )
      const rendimientoEsperado = prediccion?.rendimientoEstimadoTonHa || rendimientoReal
      
      parcelasMap[nombreParcela].productiva = rendimientoEsperado > 0
        ? (rendimientoReal / rendimientoEsperado) * 100
        : 100
      parcelasMap[nombreParcela].economica = 135 // Mock value
    })

    return Object.values(parcelasMap).map(item => ({
      ...item,
      productiva: parseFloat(item.productiva.toFixed(0)),
      economica: parseFloat(item.economica.toFixed(0))
    }))
  }

  // Generar datos de campañas desde cosechas reales (con filtros)
  const generarCampanasData = () => {
    return cosechasFiltradas.map((cosecha, index) => {
      const siembra = cosecha.siembra || {}
      const parcela = siembra.parcela || {}
      const variedad = siembra.variedad || {}
      const cultivo = variedad.cultivo || {}
      
      const rendimientoReal = cosecha.rendimientoTonHa || 0
      const prediccion = prediccionesFiltradas.find(p => p.siembra?.idSiembra === siembra.idSiembra)
      const rendimientoEsperado = prediccion?.rendimientoEstimadoTonHa || rendimientoReal
      
      const eficienciaProductiva = rendimientoEsperado > 0
        ? (rendimientoReal / rendimientoEsperado) * 100
        : 100
      
      const areaHa = cosecha.areaCosechadaHa || siembra.areaSembradaHa || 0
      const produccionKg = cosecha.cantidadCosechadaKg || 0
      const precioVenta = 4.0 // Mock price PEN/kg
      
      const costosTotales = areaHa * 2850 // Mock cost
      const ingresosTotales = (produccionKg / 1000) * precioVenta * 1000
      const roi = costosTotales > 0 ? ((ingresosTotales - costosTotales) / costosTotales * 100) : 0
      const margenNeto = ingresosTotales > 0 ? ((ingresosTotales - costosTotales) / ingresosTotales * 100) : 0

      return {
        id_unico: `${siembra.idSiembra || 'siembra'}-${cosecha.idCosecha || index}`,
        id_siembra: siembra.idSiembra || index,
        parcela: parcela.nombreParcela || 'Sin nombre',
        cultivo: `${cultivo.nombreComun || 'Sin nombre'} ${variedad.nombreVariedad || ''}`,
        area_ha: parseFloat(areaHa.toFixed(2)),
        fecha_siembra: siembra.fechaSiembra || '',
        fecha_cosecha: cosecha.fechaCosecha || '',
        rendimiento_real: parseFloat(rendimientoReal.toFixed(1)),
        rendimiento_esperado: parseFloat(rendimientoEsperado.toFixed(1)),
        eficiencia_productiva: parseFloat(eficienciaProductiva.toFixed(1)),
        costos_totales: parseFloat(costosTotales.toFixed(0)),
        ingresos_totales: parseFloat(ingresosTotales.toFixed(0)),
        roi: parseFloat(roi.toFixed(1)),
        margen_neto: parseFloat(margenNeto.toFixed(1)),
        eficiencia_riego: 85 // Mock value
      }
    })
  }

  // Calcular evolución económica por mes desde cosechas reales
  const calcularEvolucionEconomica = () => {
    if (cosechasFiltradas.length === 0) {
      return []
    }

    // Agrupar cosechas por mes
    const mesesMap = {}
    
    cosechasFiltradas.forEach(cosecha => {
      if (!cosecha.fechaCosecha) return
      
      const fecha = new Date(cosecha.fechaCosecha)
      const mesAño = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      const mesNombre = fecha.toLocaleDateString('es-PE', { month: 'short' })
      
      if (!mesesMap[mesAño]) {
        mesesMap[mesAño] = {
          mes: mesNombre,
          fecha: fecha,
          costosTotales: 0,
          ingresosTotales: 0,
          areaTotal: 0
        }
      }
      
      const areaHa = cosecha.areaCosechadaHa || cosecha.siembra?.areaSembradaHa || 0
      const produccionKg = cosecha.cantidadCosechadaKg || 0
      const precioVentaKg = 4.0
      
      const costos = areaHa * 2850
      const ingresos = (produccionKg / 1000) * precioVentaKg * 1000
      
      mesesMap[mesAño].costosTotales += costos
      mesesMap[mesAño].ingresosTotales += ingresos
      mesesMap[mesAño].areaTotal += areaHa
    })

    // Convertir a array y calcular ROI y margen
    const evolucion = Object.values(mesesMap)
      .sort((a, b) => a.fecha - b.fecha)
      .slice(-6) // Últimos 6 meses
      .map(item => ({
        mes: item.mes.charAt(0).toUpperCase() + item.mes.slice(1),
        roi: item.costosTotales > 0 
          ? parseFloat((((item.ingresosTotales - item.costosTotales) / item.costosTotales) * 100).toFixed(0))
          : 0,
        margen: item.ingresosTotales > 0
          ? parseFloat((((item.ingresosTotales - item.costosTotales) / item.ingresosTotales) * 100).toFixed(0))
          : 0
      }))

    return evolucion
  }

  const metricas = calcularMetricas()
  const rendimientoCultivos = calcularRendimientoPorCultivo()
  const eficienciaParcelas = calcularEficienciaPorParcela()
  const campanasData = generarCampanasData()
  const evolucionEconomica = calcularEvolucionEconomica()

  // Filtrar campañas por tipo
  const campanasFiltradas = filtroTipo === 'todas' 
    ? campanasData 
    : filtroTipo === 'activas'
    ? campanasData.filter(c => c.fecha_cosecha === '' || new Date(c.fecha_cosecha) > new Date())
    : campanasData.filter(c => c.fecha_cosecha !== '' && new Date(c.fecha_cosecha) <= new Date())

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de eficiencia...</p>
        </div>
      </div>
    )
  }

  const handleExportar = () => {
    try {
      if (campanasFiltradas.length === 0) {
        toast.error('No hay datos para exportar en el período seleccionado')
        return
      }

      // Preparar datos de campañas (solo las filtradas)
      const datosCampanas = campanasFiltradas.map(camp => ({
        'Parcela': camp.parcela,
        'Cultivo': camp.cultivo,
        'Área (ha)': formatearNumeroExcel(camp.area_ha),
        'Fecha Siembra': formatearFechaExcel(camp.fecha_siembra),
        'Fecha Cosecha': formatearFechaExcel(camp.fecha_cosecha),
        'Rendimiento Real (ton/ha)': formatearNumeroExcel(camp.rendimiento_real),
        'Rendimiento Esperado (ton/ha)': formatearNumeroExcel(camp.rendimiento_esperado),
        'Eficiencia Productiva (%)': formatearNumeroExcel(camp.eficiencia_productiva, 1),
        'Costos Totales (PEN)': formatearNumeroExcel(camp.costos_totales, 0),
        'Ingresos Totales (PEN)': formatearNumeroExcel(camp.ingresos_totales, 0),
        'ROI (%)': formatearNumeroExcel(camp.roi, 1),
        'Margen Neto (%)': formatearNumeroExcel(camp.margen_neto, 1),
        'Eficiencia Riego (%)': formatearNumeroExcel(camp.eficiencia_riego, 0)
      }))

      // Preparar métricas principales
      const datosMetricas = [{
        'Métrica': 'ROI Promedio',
        'Valor': `${formatearNumeroExcel(metricas.economica.roi, 1)}%`,
        'Categoría': 'Económica'
      }, {
        'Métrica': 'Margen Neto',
        'Valor': `${formatearNumeroExcel(metricas.economica.margenNeto, 1)}%`,
        'Categoría': 'Económica'
      }, {
        'Métrica': 'Costo/ha Promedio',
        'Valor': `S/ ${formatearNumeroExcel(metricas.economica.costoProduccion, 0)}`,
        'Categoría': 'Económica'
      }, {
        'Métrica': 'Ingreso/ha Promedio',
        'Valor': `S/ ${formatearNumeroExcel(metricas.economica.ingresoPromedio, 0)}`,
        'Categoría': 'Económica'
      }, {
        'Métrica': 'Rendimiento Real',
        'Valor': `${formatearNumeroExcel(metricas.productiva.rendimientoReal)} ton/ha`,
        'Categoría': 'Productiva'
      }, {
        'Métrica': 'Rendimiento Esperado',
        'Valor': `${formatearNumeroExcel(metricas.productiva.rendimientoEsperado)} ton/ha`,
        'Categoría': 'Productiva'
      }, {
        'Métrica': 'Eficiencia Productiva',
        'Valor': `${formatearNumeroExcel(metricas.productiva.eficiencia, 1)}%`,
        'Categoría': 'Productiva'
      }, {
        'Métrica': 'Precisión ML',
        'Valor': `${formatearNumeroExcel(metricas.productiva.precision, 1)}%`,
        'Categoría': 'Productiva'
      }, {
        'Métrica': 'Eficiencia Riego',
        'Valor': `${formatearNumeroExcel(metricas.riego.eficienciaPromedio, 1)}%`,
        'Categoría': 'Riego'
      }, {
        'Métrica': 'Ahorro vs Tradicional',
        'Valor': `${formatearNumeroExcel(metricas.riego.ahorroVsTradicional, 0)}%`,
        'Categoría': 'Riego'
      }, {
        'Métrica': 'Sistema Óptimo',
        'Valor': metricas.riego.sistemaOptimo,
        'Categoría': 'Riego'
      }, {
        'Métrica': 'Eficiencia Insumos',
        'Valor': `${formatearNumeroExcel(metricas.recursos.eficienciaInsumos, 1)}%`,
        'Categoría': 'Recursos'
      }, {
        'Métrica': 'Aprovechamiento Área',
        'Valor': `${formatearNumeroExcel(metricas.recursos.aprovechamientoArea, 1)}%`,
        'Categoría': 'Recursos'
      }, {
        'Métrica': 'Densidad Óptima',
        'Valor': `${formatearNumeroExcel(metricas.recursos.densidadOptima, 1)}%`,
        'Categoría': 'Recursos'
      }, {
        'Métrica': 'Pérdidas',
        'Valor': `${formatearNumeroExcel(metricas.recursos.perdidas, 1)}%`,
        'Categoría': 'Recursos'
      }]

      // Preparar rendimiento por cultivo
      const datosRendimiento = rendimientoCultivos.map(cult => ({
        'Cultivo': cult.cultivo,
        'Rendimiento Real (ton/ha)': formatearNumeroExcel(cult.real),
        'Rendimiento Esperado (ton/ha)': formatearNumeroExcel(cult.esperado),
        'Eficiencia (%)': formatearNumeroExcel(cult.eficiencia, 0)
      }))

      // Preparar eficiencia por parcela
      const datosEficienciaParcela = eficienciaParcelas.map(parc => ({
        'Parcela': parc.parcela,
        'Eficiencia Productiva (%)': formatearNumeroExcel(parc.productiva, 0),
        'Eficiencia Económica - ROI (%)': formatearNumeroExcel(parc.economica, 0),
        'Eficiencia Riego (%)': formatearNumeroExcel(parc.riego, 0)
      }))

      // Crear array de hojas
      const hojas = [
        { name: 'Resumen Campañas', data: datosCampanas },
        { name: 'Métricas Principales', data: datosMetricas },
        { name: 'Rendimiento por Cultivo', data: datosRendimiento },
        { name: 'Eficiencia por Parcela', data: datosEficienciaParcela }
      ]

      // Generar nombre de archivo con fecha actual y período
      const fecha = new Date().toISOString().split('T')[0]
      const periodoTexto = filtroPeriodo === '1mes' ? '1Mes' :
                          filtroPeriodo === '3meses' ? '3Meses' :
                          filtroPeriodo === '6meses' ? '6Meses' : '1Anio'
      const nombreArchivo = `Eficiencia_Operativa_${periodoTexto}_${fecha}`

      // Exportar a Excel con múltiples hojas
      exportMultipleSheetsToExcel(hojas, nombreArchivo)

      toast.success(`Reporte de eficiencia exportado (${campanasFiltradas.length} campañas)`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar el reporte')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eficiencia Operativa</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Análisis de rendimiento económico, productivo y uso de recursos
          </p>
          {cosechasFiltradas.length > 0 && (
            <p className="text-xs text-primary-600 mt-1 font-medium">
              Mostrando {cosechasFiltradas.length} cosecha{cosechasFiltradas.length !== 1 ? 's' : ''} del período seleccionado
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <option value="1mes">Último mes</option>
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="1año">Último año</option>
          </select>
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Mensaje si no hay datos */}
      {cosechasFiltradas.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">No hay datos en el período seleccionado</h3>
              <p className="text-xs text-yellow-700 mt-1">
                No se encontraron cosechas en el período de {
                  filtroPeriodo === '1mes' ? 'último mes' :
                  filtroPeriodo === '3meses' ? 'últimos 3 meses' :
                  filtroPeriodo === '6meses' ? 'últimos 6 meses' :
                  'último año'
                }. Intenta seleccionar un período diferente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {cosechasFiltradas.length > 0 && <EficienciaStatsCards metricas={metricas} />}

      {/* Gráficos y Métricas */}
      {cosechasFiltradas.length > 0 && (
        <div className="grid grid-cols-12 gap-5">
          {/* Columna Izquierda - Gráficos */}
          <div className="col-span-8 space-y-5">
            <EvolucionEconomica data={evolucionEconomica} />
            <RendimientoPorCultivo data={rendimientoCultivos} />
            <ComparacionParcelas data={eficienciaParcelas} />
          </div>

          {/* Columna Derecha - Paneles */}
          <div className="col-span-4 space-y-5">
            <DistribucionCostos />
            <MetricasRecursos recursos={metricas.recursos} />
            <ResumenEconomico economica={metricas.economica} riego={metricas.riego} />
          </div>
        </div>
      )}

      {/* Tabla de Campañas */}
      {cosechasFiltradas.length > 0 && (
        <EficienciaTable 
          campanas={campanasFiltradas}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
        />
      )}
    </div>
  )
}
