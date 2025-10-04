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
      <div className="flex items-center space-x-2 mt-3">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded p-2 w-full pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-50"
            placeholder="Search by Tutor, Student..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 dark:hover:bg-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600 dark:text-slate-400">
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
