import { RefreshCw, Search, Sun, Moon } from 'react-feather'
import PropTypes from 'prop-types'
import { useTheme } from '../context/ThemeContext'

export const Header = ({
  isFetching,
  handleRefresh,
  selectedYear,
  searchQuery
}) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex justify-between items-center bg-white p-4 dark:bg-slate-800 dark:text-slate-50 border-b border-gray-200 dark:border-slate-700">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-semibold">All Time Presence Data</h1>

        {selectedYear && (
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-800 dark:text-blue-100">
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
          } dark:text-slate-300`}
        >
          {isFetching ? 'Syncing...' : 'Sync Complete'}
        </span>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:hover:bg-slate-600 dark:disabled:bg-slate-900 dark:text-slate-50"
          disabled={isFetching}
          title="Refresh data from backend"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-50"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
