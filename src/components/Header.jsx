import { RefreshCw } from 'react-feather'
import PropTypes from 'prop-types'

export const Header = ({ isFetching, handleRefresh }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      <h1 className="text-lg font-semibold">All Time Presence Data</h1>
      <div className="flex items-center space-x-2">
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
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

Header.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired
}
