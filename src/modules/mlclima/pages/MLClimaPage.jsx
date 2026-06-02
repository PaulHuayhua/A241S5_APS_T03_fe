import { Routes, Route, Navigate } from 'react-router-dom'
import PrediccionesPage from './PrediccionesPage'
import DatosClimaticosPage from './DatosClimaticosPage'

const MLClimaPage = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="predicciones" replace />} />
      <Route path="predicciones" element={<PrediccionesPage />} />
      <Route path="datos-climaticos" element={<DatosClimaticosPage />} />
    </Routes>
  )
}

export default MLClimaPage
