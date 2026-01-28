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
    <div className="min-h-screen bg-notion-bg text-notion-text transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-fade-in">
          <Header
            isFetching={isFetching || isRefreshing}
            handleRefresh={handleRefresh}
            selectedYear={activeSelectedYear}
            searchQuery={activeSearchQuery}
          />

          <div className="space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isLoading={isFetching || isRefreshing}
            />

            {/* Initial State / No Search Yet */}
            {isInitialLoading && (
              <div className="text-center py-20 px-4 rounded-notion-md border border-dashed border-notion-border bg-notion-gray-light/30">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-notion-hover rounded-notion-md flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-notion-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-notion-text mb-2">Welcome to Data Sync</h2>
                  <p className="text-notion-gray font-medium">Select a year or search to explore records</p>
                </div>
              </div>
            )}

            {/* Search Results Summary */}
            {(activeSearchQuery || activeSelectedYear) && !isInitialLoading && (
              <div className="bg-notion-hover/50 border border-notion-border rounded-notion p-3 animate-slide-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-notion-blue rounded-full"></div>
                  <span className="font-semibold text-sm text-notion-text">
                    {activeSearchQuery ? `"${activeSearchQuery}"` : activeSelectedYear}
                  </span>
                </div>
                <div className="text-notion-gray font-medium text-xs uppercase tracking-tight">
                  {isFetching ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-notion-blue" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Syncing...
                    </span>
                  ) :
                    pagination ? (
                      <>
                        {pagination.totalItems.toLocaleString()} records • page {currentPage} of {pagination.totalPages}
                      </>
                    ) : (
                      `${data?.length || 0} records`
                    )}
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
