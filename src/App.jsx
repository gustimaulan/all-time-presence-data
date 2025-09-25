import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { StatusBar } from './components/StatusBar'
import { SearchBar } from './components/SearchBar'
import { YearFilter } from './components/YearFilter'
import { PresenceTable } from './components/PresenceTable'
import { usePresenceData } from './hooks/usePresenceData'
import { ToastProvider, useToast } from './context/ToastContext'
import { useDebounce } from './hooks/useDebounce'

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
    manualRefresh
  } = usePresenceData(activeSelectedYear, currentPage, 15, activeSearchQuery)

  // Determine if it's the very first loading state before any data is fetched
  const isInitialLoading = !data && !isError && (activeSelectedYear === '' && activeSearchQuery === '');

  // Reset to first page when active search query or active year changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeSearchQuery, activeSelectedYear])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    // When form is submitted, immediately set activeSearchQuery and activeSelectedYear
    setActiveSearchQuery(searchQuery)
    setActiveSelectedYear(selectedYear)
  }, [searchQuery, selectedYear])

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year)
    // Do NOT trigger API call here. It will be triggered by handleSearch.
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

          {/* Initial State / No Search Yet */}
          {isInitialLoading && (
            <div className="text-center py-10 px-4 text-gray-500">
              <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
              <p>Please select a year or use the search bar to find attendance data.</p>
            </div>
          )}

          {/* Search Results Summary (only show if a search or filter is active) */}
          {(activeSearchQuery || activeSelectedYear) && !isInitialLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-800 font-medium">
                    {activeSearchQuery ? 'Search Results' : `Data for ${activeSelectedYear}`}
                  </span>
                  {isFetching && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                </div>
                <div className="text-blue-700 text-sm">
                  {isFetching ? (
                    'Loading...'
                  ) :
                  pagination ? (
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
              
              {!isFetching && data?.length === 0 && activeSearchQuery && (
                <div className="mt-2 text-blue-700 text-sm">
                  No matches found for "{activeSearchQuery}". Try different keywords or check your spelling.
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
