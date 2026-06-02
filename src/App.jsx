import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './shared/layout/Layout'
import LoginPage from './modules/auth/pages/LoginPage'
import DashboardPage from './modules/dashboard/pages/DashboardPage'
import CatalogosPage from './modules/catalogos/pages/CatalogosPage'
import GestionPage from './modules/gestion/pages/GestionPage'
import MLClimaPage from './modules/mlclima/pages/MLClimaPage'
import AlertasPage from './modules/alertas/pages/AlertasPage'
import Eficiencia from './modules/reportes/pages/EficienciaPage'
import Configuracion from './modules/config/pages/ConfiguracionPage'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Ruta raíz redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login sin Layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas con Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="catalogos/*" element={<CatalogosPage />} />
          <Route path="gestion/*" element={<GestionPage />} />
          <Route path="mlclima/*" element={<MLClimaPage />} />
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="eficiencia" element={<Eficiencia />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
