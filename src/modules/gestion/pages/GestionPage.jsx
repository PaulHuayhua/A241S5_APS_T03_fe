import { Routes, Route, Navigate } from 'react-router-dom'
import ParcelasPage from './ParcelasPage'
import SiembrasPage from './SiembrasPage'
import CosechasPage from './CosechasPage'

const GestionPage = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="parcelas" replace />} />
      <Route path="parcelas" element={<ParcelasPage />} />
      <Route path="siembras" element={<SiembrasPage />} />
      <Route path="cosechas" element={<CosechasPage />} />
    </Routes>
  )
}

export default GestionPage
