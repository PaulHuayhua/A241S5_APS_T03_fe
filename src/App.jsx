import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Lotes from './pages/Lotes'
import Siembras from './pages/Siembras'
import Catalogos from './pages/Catalogos'
import Predicciones from './pages/Predicciones'
import Eficiencia from './pages/Eficiencia'
import Cosechas from './pages/Cosechas'
import Alertas from './pages/Alertas'
import Configuracion from './pages/Configuracion'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Ruta raíz redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login sin Layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas con Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lotes" element={<Lotes />} />
          <Route path="siembras" element={<Siembras />} />
          <Route path="catalogos" element={<Catalogos />} />
          <Route path="predicciones" element={<Predicciones />} />
          <Route path="eficiencia" element={<Eficiencia />} />
          <Route path="cosechas" element={<Cosechas />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
