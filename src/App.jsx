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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden animate-fade-in">
          <Header
            isFetching={isFetching || isRefreshing}
            handleRefresh={handleRefresh}
            selectedYear={activeSelectedYear}
            searchQuery={activeSearchQuery}
          />

          {/* StatusBar temporarily hidden */}
          {/* {!debouncedSearchQuery && (
            <StatusBar
              totalItems={pagination?.totalItems}
              filteredItems={data?.length}
              cached={cached}
              selectedYear={activeSelectedYear}
              searchQuery={activeSearchQuery}
              pagination={pagination}
            />
          )} */}

          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* <YearFilter
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
              /> */}
              
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isLoading={isFetching || isRefreshing}
              />

              {/* Initial State / No Search Yet */}
              {isInitialLoading && (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">Welcome to Presence Data</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Select a year or use the search bar to explore attendance records.</p>
                  </div>
                </div>
              )}

              {/* Search Results Summary (only show if a search or filter is active) */}
              {(activeSearchQuery || activeSelectedYear) && !isInitialLoading && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-slide-up">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-slow"></div>
                      <span className="text-primary-800 dark:text-primary-200 font-semibold text-sm sm:text-base">
                        {activeSearchQuery ? 'Search Results' : `Data for ${activeSelectedYear}`}
                      </span>
                      {isFetching && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                      )}
                    </div>
                    <div className="text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-medium">
                      {isFetching ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) :
                      pagination ? (
                        <>
                          {pagination.totalItems.toLocaleString()} results
                          {pagination.totalPages > 1 && (
                            <span className="ml-2 text-primary-600 dark:text-primary-400">
                              • Page {currentPage} of {pagination.totalPages}
                            </span>
                          )}
                        </>
                      ) : (
                        `${data?.length || 0} results`
                      )}
                    </div>
                  </div>
                  
                  {!isFetching && data?.length === 0 && activeSearchQuery && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-primary-200 dark:border-primary-700">
                      <p className="text-primary-700 dark:text-primary-300 text-xs sm:text-sm">
                        No matches found for "<span className="font-medium">{activeSearchQuery}</span>". Try different keywords or check your spelling.
                      </p>
                    </div>
                  )}
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
