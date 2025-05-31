import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { StatusBar } from './components/StatusBar'
import { SearchBar } from './components/SearchBar'
import { YearFilter } from './components/YearFilter'
import { PresenceTable } from './components/PresenceTable'
import { SkeletonLoader } from './components/SkeletonLoader'
import { usePresenceData } from './hooks/usePresenceData'
import { ToastProvider, useToast } from './context/ToastContext'
import { useDebounce } from './hooks/useDebounce'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { addToast } = useToast()
  
  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  
  const { 
    data, 
    pagination,
    cached,
    isLoading, 
    isFetching,
    isError,
    error, 
    manualRefresh
  } = usePresenceData(selectedYear, currentPage, 50, debouncedSearchQuery)

  // Reset to first page when search query or year changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, selectedYear])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year)
    setSearchQuery('')
  }, [])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      const result = await manualRefresh()
      addToast(result.message || 'Data refreshed successfully', 'success')
    } catch (error) {
      console.error('Refresh failed:', error)
      addToast(error.message || 'Failed to refresh data', 'error')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    document.getElementById('tableTop')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (isLoading) {
    return <SkeletonLoader />
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
    <div className="bg-gray-100 w-full min-h-screen flex flex-col">
      <div className="bg-white max-w-2xl w-full min-h-screen mx-auto">
        <Header 
          isFetching={isFetching || isRefreshing} 
          handleRefresh={handleRefresh}
          selectedYear={selectedYear}
          searchQuery={debouncedSearchQuery}
        />

        {/* StatusBar temporarily hidden */}
        {/* {!debouncedSearchQuery && (
          <StatusBar 
            totalItems={pagination?.totalItems}
            filteredItems={data?.length}
            cached={cached}
            selectedYear={selectedYear}
            searchQuery={debouncedSearchQuery}
            pagination={pagination}
          />
        )} */}

        <div className="p-5">
          <YearFilter
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
          
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isFetching || isRefreshing}
          />

          {/* Search Results Summary */}
          {debouncedSearchQuery && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-800 font-medium">Search Results</span>
                  {isFetching && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                </div>
                <div className="text-blue-700 text-sm">
                  {pagination ? (
                    <>
                      {pagination.totalItems} results found
                      {pagination.totalPages > 1 && (
                        <span className="ml-2">
                          (Page {currentPage} of {pagination.totalPages})
                        </span>
                      )}
                    </>
                  ) : (
                    data?.length || 0
                  )} results
                </div>
              </div>
              
              {!isFetching && data?.length === 0 && (
                <div className="mt-2 text-blue-700 text-sm">
                  No matches found for "{debouncedSearchQuery}". Try different keywords or check your spelling.
                </div>
              )}
            </div>
          )}

          <PresenceTable 
            data={data} 
            isLoading={isFetching}
            pagination={pagination}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            searchQuery={debouncedSearchQuery}
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
