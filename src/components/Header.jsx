import { RefreshCw, Search } from 'react-feather'
import PropTypes from 'prop-types'

export const Header = ({
  isFetching,
  handleRefresh,
  selectedYear,
  searchQuery
}) => {

  return (
    <div className="bg-neo-bg border-b-neo border-black p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neo-yellow border-neo-sm border-black shadow-neo flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tighter">Presence Data</h1>
              <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mt-0.5">All time</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            {selectedYear && (
              <span className="neo-badge bg-neo-pink text-black uppercase flex items-center">
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {selectedYear}
              </span>
            )}

            {searchQuery && (
              <div className="neo-badge bg-neo-blue text-black uppercase flex items-center" title={`Searching for: ${searchQuery}`}>
                <Search size={12} className="mr-1.5 stroke-[3px]" />
                Searching
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t-2 border-black md:border-t-0 pt-4 md:pt-0">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 border-2 border-black transition-all duration-300 ${isFetching ? 'bg-neo-yellow animate-pulse' : 'bg-neo-green'}`}></div>
            <span
              className={`text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${isFetching ? 'text-black opacity-100' : 'text-black/60'
                }`}
            >
              {isFetching ? 'Syncing...' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="neo-btn bg-white p-2 hover:bg-neo-yellow disabled:opacity-50 disabled:bg-gray-200 group"
              disabled={isFetching}
              title="Sync Data"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3px] ${isFetching ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
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
