import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { PresenceTable } from './components/PresenceTable'
import { SkeletonLoader } from './components/SkeletonLoader'
import { usePresenceData } from './hooks/usePresenceData'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { 
    data, 
    isLoading, 
    isFetching,
    isError,
    error, 
    manualRefresh 
  } = usePresenceData()

  const filteredData = data?.filter(item =>
    searchQuery 
      ? Object.values(item).some(value => 
          value && value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  )

  const handleSearch = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await manualRefresh()
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
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
        />

        <div className="p-5">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isFetching || isRefreshing}
          />

          <PresenceTable data={filteredData || []} />
        </div>
      </div>
    </div>
  )
}

export default App
