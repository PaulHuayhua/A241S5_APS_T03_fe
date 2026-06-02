import { useState, useEffect, useCallback } from 'react'

export const useApi = (apiFunction, immediate = false) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiFunction(...params)
        setData(response.data)
        return response.data
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error desconocido')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunction]
  )

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    data,
    loading,
    error,
    execute,
    setData,
  }
}

export default useApi
