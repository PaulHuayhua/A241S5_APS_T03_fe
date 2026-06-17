import { X, Loader2, CheckCircle2, FlaskConical, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ModalDetalle({ prediccion, onClose }) {
  if (!prediccion) return null

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getBadge = (estado) => {
    switch (estado) {
      case 'activa':     return 'bg-green-100 text-green-700 ring-1 ring-green-200'
      case 'evaluada':   return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
      case 'inactiva':   return 'bg-red-100 text-red-700 ring-1 ring-red-200'
      case 'descartada': return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
      default:           return 'bg-gray-100 text-gray-600'
    }
  }

  const confianza = parseFloat(prediccion.intervaloConfianzaPct) || 0
  const estimado  = parseFloat(prediccion.rendimientoEstimadoTonHa) || 0
  const minVal    = parseFloat(prediccion.rendimientoMinTonHa) || 0
  const maxVal    = parseFloat(prediccion.rendimientoMaxTonHa) || 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-sm">#{prediccion.idPrediccion}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Detalles de la Predicción</h3>
              <p className="text-xs text-gray-400 mt-0.5">{formatearFecha(prediccion.fechaPrediccion)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Rendimiento destacado ── */}
          <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-5 border border-primary-100">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Rendimiento Estimado</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-primary-800">{estimado.toFixed(2)}</span>
              <span className="text-lg font-semibold text-primary-600 mb-1">ton/ha</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-primary-100 rounded-full h-2 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-2 bg-primary-500 rounded-full"
                  style={{ width: `${confianza}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-primary-700 whitespace-nowrap">{confianza.toFixed(1)}% confianza</span>
            </div>
            <p className="text-xs text-primary-600 mt-2">
              Rango: <span className="font-semibold">{minVal.toFixed(2)} – {maxVal.toFixed(2)} ton/ha</span>
            </p>
          </div>

          {/* ── Info principal ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Parcela</p>
              <p className="text-sm font-semibold text-gray-900">{prediccion.siembra?.parcela?.nombreParcela || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cultivo</p>
              <p className="text-sm font-semibold text-gray-900">{prediccion.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Modelo ML</p>
              <p className="text-sm font-semibold text-gray-900">{prediccion.modelo?.nombreModelo || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Fuente Clima</p>
              <p className="text-sm font-semibold text-gray-900">{prediccion.fuenteClima || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Período Climático</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatearFecha(prediccion.fechaClimaInicio)}
                <span className="mx-2 text-gray-400">→</span>
                {formatearFecha(prediccion.fechaClimaFin)}
              </p>
            </div>
          </div>

          {/* ── Estado ── */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getBadge(prediccion.estado)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {prediccion.estado?.charAt(0).toUpperCase() + prediccion.estado?.slice(1)}
            </span>
          </div>

          {/* ── Notas ── */}
          {prediccion.notas && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Notas</p>
              <p className="text-sm text-amber-800">{prediccion.notas}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModalCambiarEstado({ prediccion, onConfirmar, onClose }) {
  if (!prediccion) return null

  const opciones = [
    {
      valor: 'activa',
      label: 'Activa',
      descripcion: 'La predicción está en uso y es válida',
      icon: CheckCircle2,
      bg: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      descColor: 'text-green-600',
      activeBg: 'bg-green-100 border-green-400',
    },
    {
      valor: 'evaluada',
      label: 'Evaluada',
      descripcion: 'La predicción fue revisada y comparada con la cosecha real',
      icon: FlaskConical,
      bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      descColor: 'text-blue-600',
      activeBg: 'bg-blue-100 border-blue-400',
    },
    {
      valor: 'descartada',
      label: 'Descartada',
      descripcion: 'La predicción fue anulada y ya no se considera válida',
      icon: XCircle,
      bg: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-700',
      descColor: 'text-gray-500',
      activeBg: 'bg-gray-100 border-gray-400',
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Cambiar Estado</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {prediccion.siembra?.parcela?.nombreParcela} — {prediccion.siembra?.variedad?.cultivo?.nombreComun}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Estado actual */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3">
            Estado actual
          </p>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            prediccion.estado === 'activa'    ? 'bg-green-100 text-green-700' :
            prediccion.estado === 'evaluada'  ? 'bg-blue-100 text-blue-700' :
            prediccion.estado === 'inactiva'  ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {prediccion.estado?.charAt(0).toUpperCase() + prediccion.estado?.slice(1)}
          </span>
        </div>

        {/* Opciones */}
        <div className="px-6 pb-4 pt-3 space-y-2">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-3">
            Selecciona nuevo estado
          </p>
          {opciones.map(({ valor, label, descripcion, icon: Icon, bg, iconColor, textColor, descColor, activeBg }) => {
            const esActual = prediccion.estado === valor
            return (
              <button
                key={valor}
                onClick={() => !esActual && onConfirmar(valor)}
                disabled={esActual}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left
                  ${esActual ? `${activeBg} cursor-default opacity-60` : `${bg} cursor-pointer`}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  esActual ? 'bg-white bg-opacity-80' : 'bg-white'
                }`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${textColor}`}>
                    {label}
                    {esActual && <span className="ml-2 text-xs font-normal opacity-70">(actual)</span>}
                  </p>
                  <p className={`text-xs mt-0.5 ${descColor} opacity-80`}>{descripcion}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModalEliminar({ prediccion, onConfirmar, onClose }) {
  if (!prediccion) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Desactivar Predicción</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700">
            ¿Deseas desactivar la predicción de{' '}
            <span className="font-semibold">
              {prediccion.siembra?.parcela?.nombreParcela || 'N/A'} -{' '}
              {prediccion.siembra?.variedad?.cultivo?.nombreComun || 'N/A'}
            </span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            El registro se marcará como <span className="font-semibold text-red-600">inactiva</span> y podrás restaurarlo cuando quieras.
          </p>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModalEditar({ prediccion, siembrasDisponibles, onConfirmar, onClose }) {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (!prediccion) return
    setErrors({})
    setForm({
      idSiembra: prediccion.siembra?.idSiembra ?? '',
      idModelo: prediccion.modelo?.idModelo ?? '',
      fechaClimaInicio: prediccion.fechaClimaInicio ?? '',
      fechaClimaFin: prediccion.fechaClimaFin ?? '',
      fuenteClima: prediccion.fuenteClima ?? 'SENAMHI',
      notas: prediccion.notas ?? '',
    })
  }, [prediccion])

  if (!prediccion || !form) return null

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.idSiembra) errs.idSiembra = 'Selecciona una siembra'
    if (!form.fechaClimaInicio) errs.fechaClimaInicio = 'Requerido'
    if (!form.fechaClimaFin) errs.fechaClimaFin = 'Requerido'
    if (form.fechaClimaInicio && form.fechaClimaFin && form.fechaClimaInicio > form.fechaClimaFin)
      errs.fechaClimaFin = 'La fecha fin debe ser posterior al inicio'
    return errs
  }

  const handleGuardar = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const payload = {
        ...prediccion,
        siembra: { idSiembra: parseInt(form.idSiembra) },
        modelo: { idModelo: parseInt(form.idModelo) },
        fechaClimaInicio: form.fechaClimaInicio,
        fechaClimaFin: form.fechaClimaFin,
        fuenteClima: form.fuenteClima,
        notas: form.notas,
        // estado se conserva tal como está, no se modifica aquí
      }
      await onConfirmar(prediccion.idPrediccion, payload)
    } finally {
      setSaving(false)
    }
  }

  const modelosOpciones = [
    { id: 1, nombre: 'Random Forest v2.1' },
    { id: 2, nombre: 'XGBoost v1.8' },
    { id: 3, nombre: 'LSTM v1.2' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editar Predicción</h3>
            <p className="text-xs text-gray-500 mt-0.5">ID #{prediccion.idPrediccion}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Siembra */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
              Siembra *
            </label>
            <select
              value={form.idSiembra}
              onChange={e => set('idSiembra', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white transition-colors ${
                errors.idSiembra ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Seleccionar siembra</option>
              {siembrasDisponibles.map(s => (
                <option key={s.idSiembra} value={s.idSiembra}>
                  {s.parcela?.nombreParcela} — {s.variedad?.cultivo?.nombreComun}
                </option>
              ))}
            </select>
            {errors.idSiembra && <p className="text-xs text-red-500 mt-1">{errors.idSiembra}</p>}
          </div>

          {/* Modelo ML */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
              Modelo ML *
            </label>
            <select
              value={form.idModelo}
              onChange={e => set('idModelo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
            >
              {modelosOpciones.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fechas en grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                Fecha Inicio Clima *
              </label>
              <input
                type="date"
                value={form.fechaClimaInicio}
                onChange={e => set('fechaClimaInicio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors ${
                  errors.fechaClimaInicio ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.fechaClimaInicio && <p className="text-xs text-red-500 mt-1">{errors.fechaClimaInicio}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                Fecha Fin Clima *
              </label>
              <input
                type="date"
                value={form.fechaClimaFin}
                onChange={e => set('fechaClimaFin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors ${
                  errors.fechaClimaFin ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.fechaClimaFin && <p className="text-xs text-red-500 mt-1">{errors.fechaClimaFin}</p>}
            </div>
          </div>

          {/* Fuente Clima */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
              Fuente Clima
            </label>
            <select
              value={form.fuenteClima}
              onChange={e => set('fuenteClima', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white hover:border-gray-400 transition-colors"
            >
              <option value="SENAMHI">SENAMHI</option>
              <option value="NASA POWER">NASA POWER</option>
              <option value="OpenWeather">OpenWeather</option>
              <option value="Estación Local">Estación Local</option>
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
              Notas
            </label>
            <textarea
              value={form.notas}
              onChange={e => set('notas', e.target.value)}
              rows={3}
              placeholder="Observaciones adicionales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none hover:border-gray-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
