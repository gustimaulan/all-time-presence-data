import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { parseDate } from '../utils/dateUtils'

const BASE_URL = "https://presensi.sigmath.net/api"
const CACHE_TIME = 1000 * 60 * 5 // 5 minutes
const STALE_TIME = 1000 * 60 * 1 // 1 minute

export const usePresenceData = () => {
  const queryClient = useQueryClient()

  const fetchData = async () => {
    const { data } = await axios.get(`${BASE_URL}/data`)
    return data.data.sort((a, b) => {
      const dateA = parseDate(a["Hari dan Tanggal Les"])
      const dateB = parseDate(b["Hari dan Tanggal Les"])
      return dateB - dateA
    })
  }

  const refreshData = async () => {
    const { data } = await axios.get(`${BASE_URL}/refresh`)
    return data.data.sort((a, b) => {
      const dateA = parseDate(a["Hari dan Tanggal Les"])
      const dateB = parseDate(b["Hari dan Tanggal Les"])
      return dateB - dateA
    })
  }

  const query = useQuery({
    queryKey: ['presence-data'],
    queryFn: fetchData,
    staleTime: STALE_TIME, // Data becomes stale after 1 minute
    cacheTime: CACHE_TIME, // Cache is kept for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when internet reconnects
    retry: 3, // Retry failed requests 3 times
  })

  // Prefetch the next data refresh
  queryClient.prefetchQuery({
    queryKey: ['presence-data'],
    queryFn: fetchData,
    staleTime: STALE_TIME,
  })

  const manualRefresh = async () => {
    try {
      await refreshData()
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['presence-data'] })
    } catch (error) {
      console.error('Manual refresh failed:', error)
      throw error
    }
  }

  return {
    ...query,
    manualRefresh
  }
}
