import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../axios'

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
  if (error.response) {
    const message = error.response?.data?.message || error.message
    throw new APIError(message, error.response?.status, error.response?.data)
  }
  throw error
}

export const usePresenceData = (year = null, page = 1, pageSize = 15, searchQuery = '') => {
  const queryClient = useQueryClient()

  const fetchData = async () => {
    try {
            let search
            if (searchQuery && searchQuery.trim() !== '') {
              try {
                search = JSON.parse(searchQuery.trim())
              } catch (e) {
                search = { teacher: searchQuery.trim() }
              }
            }

            const requestBody = {
              page,
              pageSize,
              year: year && year !== '' ? year : undefined,
              search
            }
      
            const { data } = await api.post('/data/query', requestBody)      
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
    // Only run query if user is authenticated AND
    // either a search query is present or a year is selected.
    // This prevents fetching on initial load.
    enabled: searchQuery.trim() !== '' || (!!year && year !== ''),
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
