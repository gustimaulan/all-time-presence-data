import PropTypes from 'prop-types'

export const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isLoading 
}) => {
  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border rounded p-2 w-full mt-3"
        placeholder="Type to search..."
      />
      <button 
        type="submit"
        className={`w-full hidden rounded text-white px-4 py-2 mt-2 ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Syncing...' : 'Search'}
      </button>
    </form>
  )
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}
