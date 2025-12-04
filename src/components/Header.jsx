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
    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-slate-600">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Presence Data</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Attendance management system</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedYear && (
              <span className="inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {selectedYear}
              </span>
            )}

            {searchQuery && (
              <div className="inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" title={`Searching for: ${searchQuery}`}>
                <Search size={12} className="mr-1" />
                Searching
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isFetching ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span
              className={`text-xs sm:text-sm font-medium transition-all duration-500 ${
                isFetching ? 'text-yellow-600 dark:text-yellow-400 opacity-100' : 'text-green-600 dark:text-green-400 opacity-70'
              }`}
            >
              {isFetching ? 'Syncing' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-slate-600 rounded-lg">
            <button
              onClick={handleRefresh}
              className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFetching}
              title="Refresh data"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>

            <div className="w-px h-4 sm:h-6 bg-gray-300 dark:bg-slate-500"></div>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-700 transition-all duration-200"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={14} className="sm:w-4 sm:h-4" /> : <Sun size={14} className="sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
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
