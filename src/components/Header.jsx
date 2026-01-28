import { RefreshCw, Search } from 'react-feather'
import PropTypes from 'prop-types'

export const Header = ({
  isFetching,
  handleRefresh,
  selectedYear,
  searchQuery
}) => {

  return (
    <div className="py-4 border-b border-notion-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-notion bg-notion-orange/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-notion-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-notion-text">Presence Data</h1>
              <p className="text-[10px] font-medium text-notion-gray uppercase tracking-wider">All time records</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedYear && (
              <span className="notion-badge bg-notion-pink/40 text-notion-text">
                <svg className="w-3 h-3 mr-1.5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {selectedYear}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-4 border-t border-notion-border md:border-t-0 pt-4 md:pt-0">
          <div className="flex items-center space-x-2.5">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isFetching ? 'bg-notion-blue animate-pulse' : 'bg-notion-green'}`}></div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${isFetching ? 'text-notion-blue' : 'text-notion-gray'
                }`}
            >
              {isFetching ? 'Syncing...' : 'Ready'}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="notion-btn-ghost p-1.5 rounded-notion text-notion-gray hover:text-notion-text"
            disabled={isFetching}
            title="Sync Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
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
