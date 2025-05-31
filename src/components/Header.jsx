import { RefreshCw, Search } from 'react-feather'
import PropTypes from 'prop-types'

export const Header = ({ 
  isFetching, 
  handleRefresh, 
  selectedYear, 
  searchQuery 
}) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-semibold">All Time Presence Data</h1>
        
        {selectedYear && (
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {selectedYear}
          </span>
        )}
        
        {searchQuery && (
          <div className="flex items-center text-green-600" title={`Searching for: ${searchQuery}`}>
            <Search size={14} />
            <span className="ml-1 text-xs">Searching</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <span 
          id="syncStatus" 
          className={`text-gray-600 text-sm transition-opacity duration-500 ${
            isFetching ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isFetching ? 'Syncing...' : 'Sync Complete'}
        </span>
        
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={isFetching}
          title="Refresh data from backend"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

Header.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  selectedYear: PropTypes.string,
  searchQuery: PropTypes.string
}
