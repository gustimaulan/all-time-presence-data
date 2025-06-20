import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Backend API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
const CACHE_TIME = 1000 * 60 * 30 // 30 minutes
const STALE_TIME = 1000 * 60 * 5  // 5 minutes

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message
    throw new APIError(message, error.response?.status, error.response?.data)
  }
  throw error
}

export const usePresenceData = (year = null, page = 1, pageSize = 50, searchQuery = '') => {
  const queryClient = useQueryClient()

  const fetchData = async () => {
    try {
      const params = { 
        page, 
        pageSize,
        year: year && year !== '' ? year : undefined,
        search: searchQuery && searchQuery.trim() !== '' ? searchQuery.trim() : undefined
      }

      const { data } = await axios.get(`${BASE_URL}/data`, { params })
      
      return {
        items: data.data || [],
        pagination: data.pagination || null,
        cached: data.cached || false
      }
    } catch (error) {
      handleError(error)
    }
  }

  const query = useQuery({
    queryKey: ['presence-data', year, page, pageSize, searchQuery],
    queryFn: fetchData,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        return false
      }
      if (error instanceof APIError && error.status >= 500) {
        return failureCount < 3
      }
      return false
    },
    onError: (error) => {
      console.error('Error fetching presence data from backend:', error)
    }
  })

  const manualRefresh = async () => {
    try {
      const refreshResult = await fetchData()
      
      // Invalidate all presence-data queries to refetch with latest data
      await queryClient.invalidateQueries({ queryKey: ['presence-data'] })
      
      return refreshResult
    } catch (error) {
      console.error('Manual refresh failed:', error)
      throw error
    }
  }

  return {
    data: query.data?.items || [],
    pagination: query.data?.pagination || null,
    cached: query.data?.cached || false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    manualRefresh,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt,
    lastErrorAt: query.errorUpdatedAt
  }
}
