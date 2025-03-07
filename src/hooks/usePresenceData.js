import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { parseDate } from '../utils/dateUtils'

const BASE_URL = "https://presensi.sigmath.net/api"
const CACHE_TIME = 1000 * 60 * 30 // 30 minutes
const STALE_TIME = 1000 * 60 * 5  // 5 minutes

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
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    refetchOnWindowFocus: false, // Only refetch manually or when stale
    refetchOnReconnect: true,
    retry: 2,
  })

  const manualRefresh = async () => {
    try {
      await refreshData()
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
