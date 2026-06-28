import { API_CONFIG } from '../../config/api'

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token')

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Adjuntar token JWT si existe
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      // Token expirado o inválido → redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Si la respuesta no tiene contenido (204 No Content o DELETE exitoso), retornar null
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return null
      }

      const text = await response.text()
      return text ? JSON.parse(text) : null
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export default new ApiService()
