import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { siembraService } from '../../gestion/services/siembra.service'
import { cosechaService } from '../../gestion/services/cosecha.service'
import { alertaService } from '../../alertas/services'
import { climaService } from '../../mlclima/services/clima.service'

export const useDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    rendimientoPromedio: 0,
    campanasActivas: 0,
    alertasTempranas: 0,
    siembrasRecientes: [],
    alertasClimaticas: []
  })
  const [precipitacionData, setPrecipitacionData] = useState([])
  const [climaActual, setClimaActual] = useState({
    temperatura: 28,
    ubicacion: 'Piura, Perú',
    humedad: 65,
    viento: 12
  })

  const formatearFecha = (fecha) => {
    if (!fecha) return '-'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // Función para agrupar datos climáticos por semanas
  const agruparPorSemanas = (datos) => {
    if (!datos || datos.length === 0) return []
    
    const semanas = []
    const hoy = new Date()
    
    // Crear 6 semanas hacia atrás
    for (let i = 5; i >= 0; i--) {
      const finSemana = new Date(hoy)
      finSemana.setDate(finSemana.getDate() - (i * 7))
      
      const inicioSemana = new Date(finSemana)
      inicioSemana.setDate(inicioSemana.getDate() - 6)
      
      // Filtrar datos de esta semana
      const datosSemana = datos.filter(d => {
        const fecha = new Date(d.fecha)
        return fecha >= inicioSemana && fecha <= finSemana
      })
      
      // Calcular precipitación acumulada de la semana
      const precipitacionTotal = datosSemana.reduce((sum, d) => 
        sum + (Number(d.precipitacionMm) || 0), 0
      )
      
      semanas.push({
        semana: `S${6 - i}`,
        mm: Math.round(precipitacionTotal),
        fecha: finSemana.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
      })
    }
    
    return semanas
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        
        // Cargar datos en paralelo
        const [siembrasRes, cosechasRes, alertasRes] = await Promise.all([
          siembraService.getAll(),
          cosechaService.getAll(),
          alertaService.getAll()
        ])
        
        // Filtrar siembras activas
        const siembrasActivas = siembrasRes.filter(s => s.estado === 'en_curso')
        
        // Filtrar alertas activas
        const alertasActivasData = alertasRes.filter(a => a.activa)
        
        // Obtener región de la primera siembra para datos climáticos
        let regionId = null
        let regionNombre = 'Piura, Perú'
        
        if (siembrasActivas.length > 0 && siembrasActivas[0].parcela?.region) {
          const region = siembrasActivas[0].parcela.region
          regionId = region.idRegion
          regionNombre = `${region.provincia}, ${region.departamento?.nombre || 'Perú'}`
        }
        
        // Cargar datos climáticos reales si hay región disponible
        let datosClimaticos = []
        let climaActualData = {
          temperatura: 28,
          ubicacion: regionNombre,
          humedad: 65,
          viento: 12
        }
        
        if (regionId) {
          try {
            // Obtener datos climáticos de las últimas 6 semanas
            const fechaFin = new Date()
            const fechaInicio = new Date()
            fechaInicio.setDate(fechaFin.getDate() - 42) // 6 semanas = 42 días
            
            const fechaInicioStr = fechaInicio.toISOString().split('T')[0]
            const fechaFinStr = fechaFin.toISOString().split('T')[0]
            
            datosClimaticos = await climaService.getByRegionAndDateRange(
              regionId,
              fechaInicioStr,
              fechaFinStr
            )
            
            // Obtener datos climáticos del último día para el widget de clima
            if (datosClimaticos.length > 0) {
              const ultimoDato = datosClimaticos[datosClimaticos.length - 1]
              climaActualData = {
                temperatura: Math.round(Number(ultimoDato.tempPromedioC || ultimoDato.tempMaxC || 28)),
                ubicacion: regionNombre,
                humedad: Math.round(Number(ultimoDato.humedadRelativaPct || 65)),
                viento: Math.round(Number((ultimoDato.velocidadVientoMs || 3.3) * 3.6)) // convertir m/s a km/h
              }
            }
          } catch (error) {
            console.warn('No se pudieron cargar datos climáticos, usando valores por defecto:', error)
          }
        }
        
        setClimaActual(climaActualData)
        
        // Calcular rendimiento promedio
        let rendimientoPromedio = 0
        if (cosechasRes.length > 0) {
          const totalRendimiento = cosechasRes.reduce((sum, c) => sum + (c.rendimientoTonHa || 0), 0)
          rendimientoPromedio = totalRendimiento / cosechasRes.length
        }
        
        // Formatear siembras recientes para el dashboard
        const siembrasRecientes = siembrasActivas.slice(0, 4).map(s => {
          // Construir nombre del cultivo de manera segura
          let nombreCultivo = 'Sin cultivo'
          if (s.variedad?.cultivo?.nombreComun) {
            nombreCultivo = s.variedad.cultivo.nombreComun
            if (s.variedad.nombreVariedad) {
              nombreCultivo += ` - ${s.variedad.nombreVariedad}`
            }
          }
          
          return {
            cultivo: nombreCultivo,
            parcela: s.parcela?.nombreParcela || 'Sin parcela',
            fecha: formatearFecha(s.fechaSiembra),
            area: s.areaSembradaHa?.toFixed(2) || '0.00'
          }
        })
        
        // Formatear alertas climáticas para el dashboard
        const alertasClimaticas = alertasActivasData.slice(0, 3).map(a => ({
          tipo: a.tipoEvento || 'Alerta',
          mensaje: a.descripcion || 'Sin descripción',
          severidad: a.nivelRiesgo || 'BAJA'
        }))
        
        setStats({
          rendimientoPromedio: parseFloat(rendimientoPromedio.toFixed(1)),
          campanasActivas: siembrasActivas.length,
          alertasTempranas: alertasActivasData.filter(a => 
            a.nivelRiesgo === 'CRITICO' || a.nivelRiesgo === 'ALTO'
          ).length,
          siembrasRecientes,
          alertasClimaticas
        })
        
        // Procesar datos de precipitación por semanas
        if (datosClimaticos.length > 0) {
          const precipitacionesPorSemana = agruparPorSemanas(datosClimaticos)
          setPrecipitacionData(precipitacionesPorSemana)
        } else {
          // Generar datos de ejemplo si no hay datos reales
          const semanas = []
          const hoy = new Date()
          for (let i = 5; i >= 0; i--) {
            const fecha = new Date(hoy)
            fecha.setDate(fecha.getDate() - (i * 7))
            semanas.push({
              semana: `S${6 - i}`,
              mm: Math.floor(Math.random() * 60) + 20,
              fecha: fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
            })
          }
          setPrecipitacionData(semanas)
        }
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error)
        toast.error('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  return {
    loading,
    stats,
    precipitacionData,
    climaActual
  }
}
