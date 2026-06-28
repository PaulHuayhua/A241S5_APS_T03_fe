import { API_CONFIG } from '../../../config/api'

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || 'Credenciales inválidas')
    }

    return res.json() // { token, nombre, email, rol }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getUser() {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  },
}
