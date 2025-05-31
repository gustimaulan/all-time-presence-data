import { X, Search } from 'react-feather'
import PropTypes from 'prop-types'

export const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isLoading 
}) => {
  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-full mt-3 pl-10 pr-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Search by name, date, time..."
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
      </div>
      
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Searching for:</span> "{searchQuery}"
        </div>
      )}
    </form>
  )
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}
