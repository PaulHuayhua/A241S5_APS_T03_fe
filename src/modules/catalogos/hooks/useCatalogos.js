import { useState, useCallback } from 'react'
import { cultivoService } from '../services'

export const useCatalogos = () => {
  const [cultivos, setCultivos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCultivos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await cultivoService.getAll()
      setCultivos(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    cultivos,
    loading,
    error,
    fetchCultivos,
  }
}
