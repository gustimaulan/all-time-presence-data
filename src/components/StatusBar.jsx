import { Database } from 'react-feather'
import PropTypes from 'prop-types'

export const StatusBar = ({
  totalItems,
  filteredItems,
  cached,
  selectedYear,
  searchQuery,
  pagination
}) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 dark:bg-slate-700 dark:border-slate-600">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Record Count */}
        <div className="flex items-center space-x-2">
          {(totalItems !== undefined || filteredItems !== undefined) && (
            <span className="text-sm text-gray-600 dark:text-slate-300">
              {searchQuery && filteredItems !== undefined ? (
                <>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{filteredItems}</span> search results
                  {pagination?.totalPages > 1 && (
                    <span className="text-gray-500 ml-1 dark:text-slate-400">
                      (Page {pagination.currentPage} of {pagination.totalPages})
                    </span>
                  )}
                </>
              ) : totalItems !== undefined ? (
                <>
                  <span className="font-medium">{totalItems}</span> records
                  {selectedYear && <span className="text-gray-500 dark:text-slate-400"> ({selectedYear})</span>}
                </>
              ) : (
                <><span className="font-medium">{filteredItems}</span> records</>
              )}
            </span>
          )}
        </div>
        
        {/* Cache Status */}
        {cached && (
          <div className="flex items-center text-blue-500 dark:text-blue-400" title="Data served from cache">
            <Database size={14} />
            <span className="ml-1 text-xs">Cached Data</span>
          </div>
        )}
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  totalItems: PropTypes.number,
  filteredItems: PropTypes.number,
  cached: PropTypes.bool,
  selectedYear: PropTypes.string,
  searchQuery: PropTypes.string,
  pagination: PropTypes.object
} 