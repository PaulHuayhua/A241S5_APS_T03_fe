import { Navigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/context/AuthContext'

/**
 * Componente que protege rutas privadas.
 * Si el usuario no está autenticado, redirige al login.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
