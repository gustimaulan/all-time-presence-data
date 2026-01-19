import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { StatusBar } from './components/StatusBar'
import { SearchBar } from './components/SearchBar'
import { YearFilter } from './components/YearFilter'
import { PresenceTable } from './components/PresenceTable'
import { usePresenceData } from './hooks/usePresenceData'
import { ToastProvider, useToast } from './context/ToastContext'
import { useDebounce } from './hooks/useDebounce'
import axios from './axios'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('') // This will trigger the API call
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()) // Year selected in filter, but not yet applied
  const [activeSelectedYear, setActiveSelectedYear] = useState('') // Year actually applied to API call
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { addToast } = useToast()

  const {
    data,
    pagination,
    cached,
    isLoading,
    isFetching,
    isError,
    error,
    manualRefresh,
    queryClient
  } = usePresenceData(activeSelectedYear, currentPage, 15, activeSearchQuery)

  // Determine if it's the very first loading state before any data is fetched
  const isInitialLoading = !data && !isError && (activeSelectedYear === '' && activeSearchQuery === '');

  // Reset to first page when active search query or active year changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeSearchQuery, activeSelectedYear])

  const handleSearch = useCallback((query) => {
    // When form is submitted, immediately set activeSearchQuery and activeSelectedYear
    setActiveSearchQuery(query)
    setActiveSelectedYear(selectedYear)
  }, [selectedYear])

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year)
    // Do NOT trigger API call here. It will be triggered by handleSearch.
  }, [])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      // Only clear cache, don't fetch new data
      await axios.post('/cache/clear')
      addToast('Cache cleared successfully!', 'success')

      // Invalidate React Query cache to force fresh fetch on next interaction
      queryClient.invalidateQueries({ queryKey: ['presence-data'] })
    } catch (error) {
      console.error('Cache clear failed:', error)
      addToast(error.message || 'Failed to clear cache', 'error')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    document.getElementById('tableTop')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error loading data</h2>
          <p>{error.message}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neo-bg transition-colors duration-300">
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
        <div className="bg-white border-neo border-black shadow-neo-lg overflow-hidden animate-fade-in">
          <Header
            isFetching={isFetching || isRefreshing}
            handleRefresh={handleRefresh}
            selectedYear={activeSelectedYear}
            searchQuery={activeSearchQuery}
          />

          <div className="p-4 sm:p-8">
            <div className="space-y-6 sm:space-y-8">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isLoading={isFetching || isRefreshing}
              />

              {/* Initial State / No Search Yet */}
              {isInitialLoading && (
                <div className="text-center py-12 sm:py-20 px-4 neo-card bg-white border-dashed">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-neo-yellow border-neo-sm border-black shadow-neo flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter mb-4">Welcome to Data Sync</h2>
                    <p className="text-sm sm:text-base font-bold text-black/70 uppercase">Select a year or search to explore records</p>
                  </div>
                </div>
              )}

              {/* Search Results Summary */}
              {(activeSearchQuery || activeSelectedYear) && !isInitialLoading && (
                <div className="bg-neo-blue border-neo-sm border-black shadow-neo-sm rounded-neo p-4 animate-slide-up text-black">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-neo-yellow border-2 border-black animate-pulse rounded-full"></div>
                      <span className="font-black uppercase tracking-widest text-sm sm:text-base">
                        {activeSearchQuery ? `SEARCH: "${activeSearchQuery}"` : `YEAR: ${activeSelectedYear}`}
                      </span>
                    </div>
                    <div className="bg-black text-white px-3 py-1 border-neo-sm border-white font-black text-xs sm:text-sm uppercase tracking-tighter">
                      {isFetching ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neo-yellow" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          SYNCING DATA
                        </span>
                      ) :
                        pagination ? (
                          <>
                            {pagination.totalItems.toLocaleString()} RECORDS • PAGE {currentPage} / {pagination.totalPages}
                          </>
                        ) : (
                          `${data?.length || 0} RECORDS`
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Only render table if it's not the initial state */}
              {!isInitialLoading && (
                <PresenceTable
                  data={data}
                  isLoading={isFetching}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  searchQuery={activeSearchQuery}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppWrapper() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

export default AppWrapper
